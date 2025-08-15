setPageTitle("Dashboard");
let user, profile, unsub;

requireAuth().then(async (u)=>{
  user = u;
  const doc = await db.collection('users').doc(u.uid).get();
  profile = doc.data();
  initTiersUI();
  subscribeStats();
});

function initTiersUI(){
  const wrap = document.getElementById('tiersList');
  wrap.innerHTML = "";
  TIERS.forEach(t=>{
    const div = document.createElement('div');
    div.className="kpi";
    div.innerHTML = `
      <div><span class="${t.label}">${t.name}</span></div>
      <div style="margin-left:auto;text-align:right">
        <div>${t.threshold.toLocaleString()} clicks/month</div>
        <div class="help">${t.reward?('Reward: '+t.reward):'No reward'}</div>
      </div>`;
    wrap.appendChild(div);
  });
}

function detectTier(monthly){
  let current = TIERS[0];
  for(const t of TIERS){
    if(monthly>=t.threshold) current = t;
  }
  return current;
}

function subscribeStats(){
  const ref = db.collection('users').doc(user.uid);
  unsub = ref.onSnapshot(snap=>{
    const d = snap.data(); if(!d) return;
    // Month rollover
    const mk = monthKey();
    if(d.monthKey !== mk){
      ref.update({ monthKey: mk, monthlyClicks: 0, monthlyCountryCounts: {} });
      return; // will re-trigger
    }

    document.getElementById('totalClicks').textContent = fmt(d.totalClicks);
    document.getElementById('monthlyClicks').textContent = fmt(d.monthlyClicks);
    const tier = detectTier(d.monthlyClicks||0);
    document.getElementById('tierName').textContent = tier.name;

    const tbody = document.querySelector('#countryTable tbody');
    tbody.innerHTML = "";
    const mcc = d.monthlyCountryCounts||{};
    Object.keys(mcc).sort((a,b)=>mcc[b]-mcc[a]).forEach(c=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c}</td><td>${fmt(mcc[c])}</td>`;
      tbody.appendChild(tr);
    });
    makeTableSortable(document.getElementById('countryTable'));

    // Claim button visibility
    const claimBtn = document.getElementById('claimBtn');
    if(tier.reward && (d.monthlyClicks||0) >= tier.threshold){
      claimBtn.classList.remove('hidden');
      claimBtn.onclick = ()=> claimReward(tier);
    }else{
      claimBtn.classList.add('hidden');
    }

    // Work with us badge
    const work = document.getElementById('workWithUsBadge');
    work.innerHTML = tier.key==="gold"||tier.key==="diamond" ? `<span class="badge green">Eligible</span>` : `<span class="badge blue">Not yet</span>`;
  });
}

async function claimReward(tier){
  const msg = document.getElementById('claimMsg');
  msg.textContent="";
  try{
    const ref = db.collection('users').doc(user.uid);
    await db.runTransaction(async (tx)=>{
      const snap = await tx.get(ref);
      const d = snap.data(); if(!d) throw new Error("Profile missing");
      if((d.monthlyClicks||0) < tier.threshold) throw new Error("Criteria not met.");
      tx.update(ref, { monthlyClicks: 0, monthlyCountryCounts: {} });
      tx.set(db.collection('claims').doc(), {
        uid: user.uid, userId: d.userId, tier: tier.key, reward: tier.reward,
        monthKey: d.monthKey, createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    msg.textContent = "Claim recorded. Your monthly counter is reset.";
  }catch(e){
    msg.textContent = e.message;
  }
}
