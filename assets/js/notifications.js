setPageTitle("Notifications");
let user, lastDoc=null, firstDoc=null, pageStack=[];

requireAuth().then(async (u)=>{
  user = u;
  loadPage();
});

async function loadPage(dir=0){
  let query = db.collection('messages')
    .where('target','in',[user.uid,'all'])
    .orderBy('createdAt','desc')
    .limit(10);

  if(dir===1 && lastDoc){ query = query.startAfter(lastDoc); }
  if(dir===-1){
    // simple stack for prev
    const prev = pageStack.pop();
    if(prev){ query = prev; } else return;
  }

  const snap = await query.get();
  if(snap.docs.length){
    firstDoc = snap.docs[0];
    lastDoc = snap.docs[snap.docs.length-1];
    pageStack.push(db.collection('messages')
      .where('target','in',[user.uid,'all'])
      .orderBy('createdAt','desc')
      .startAfter(lastDoc)
      .limit(10));
  }

  const tbody = document.querySelector('#notifTable tbody');
  tbody.innerHTML = "";
  snap.forEach(d=>{
    const m = d.data();
    const when = m.createdAt?.toDate?.() || new Date();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${when.toLocaleString()}</td><td>${m.from||'Admin'}</td><td>${m.text}</td>`;
    tbody.appendChild(tr);
  });

  makeTableSortable(document.getElementById('notifTable'));
  bindTableSearch(document.getElementById('search'), document.getElementById('notifTable'));
}

document.getElementById('nextBtn').onclick = ()=>loadPage(1);
document.getElementById('prevBtn').onclick = ()=>loadPage(-1);
