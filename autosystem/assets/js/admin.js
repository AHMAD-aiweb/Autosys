setPageTitle("Admin");

// Gate: simple password check stored in sessionStorage by modal
if(sessionStorage.getItem('isAdmin')!=="1"){ location.href="index.html"; }

// Users table
const usersTable = document.getElementById('usersTable');
const usersTbody = usersTable.querySelector('tbody');
const userSearch = document.getElementById('userSearch');
bindTableSearch(userSearch, usersTable);

db.collection('users').onSnapshot(snap=>{
  usersTbody.innerHTML = "";
  snap.forEach(d=>{
    const u = d.data();
    const countries = Object.entries(u.countryCounts||{}).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c,n])=>`${c} (${fmt(n)})`).join(', ');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.userId}</td><td>${u.firstName}</td><td>${u.lastName}</td><td>${u.email}</td>
      <td>${u.phone}</td><td>${u.address}</td><td>${u.gender}</td>
      <td>${fmt(u.totalClicks)}</td><td>${countries||'-'}</td>
      <td>
        <button class="btn ghost" onclick="editUser('${u.uid}')">Edit</button>
        <button class="btn danger" onclick="deleteUser('${u.uid}')">Delete</button>
      </td>`;
    usersTbody.appendChild(tr);
  });
  makeTableSortable(usersTable);
});

window.editUser = async (uid)=>{
  const doc = await db.collection('users').doc(uid).get();
  if(!doc.exists) return;
  const u = doc.data();
  const first = prompt("First name:", u.firstName); if(first===null) return;
  const last = prompt("Last name:", u.lastName); if(last===null) return;
  const phone = prompt("Phone:", u.phone); if(phone===null) return;
  await db.collection('users').doc(uid).update({ firstName:first, lastName:last, phone });
};

window.deleteUser = async (uid)=>{
  if(!confirm("Delete user and their data?")) return;
  await db.collection('users').doc(uid).delete();
  // Optionally: delete their links/messages/etc. in a real backend.
};

// Download users PDF
document.getElementById('downloadUsers').onclick = ()=>{
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("AutoSystem - Users", 14, 16);
  let y = 24;
  Array.from(usersTbody.rows).forEach((r,i)=>{
    const txt = Array.from(r.cells).slice(0,9).map(td=>td.innerText).join(" | ");
    doc.text(txt, 14, y);
    y += 6; if(y>280){ doc.addPage(); y=16; }
  });
  doc.save("users.pdf");
};

// Resumes
const resumesTable = document.getElementById('resumesTable');
const resumesTbody = resumesTable.querySelector('tbody');
const resumeSearch = document.getElementById('resumeSearch');
bindTableSearch(resumeSearch, resumesTable);

db.collection('resumes').orderBy('createdAt','desc').onSnapshot(snap=>{
  resumesTbody.innerHTML = "";
  snap.forEach(d=>{
    const r = d.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.id}</td><td>${r.name}</td><td>${r.email}</td><td>${r.phone}</td><td>${(r.education||'').slice(0,30)}...</td><td><a class="btn secondary" href="${r.fileUrl}" target="_blank">Download</a></td>`;
    resumesTbody.appendChild(tr);
  });
  makeTableSortable(resumesTable);
});
document.getElementById('downloadResumes').onclick = ()=>{
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("AutoSystem - Resumes", 14, 16);
  let y=24;
  Array.from(resumesTbody.rows).forEach(r=>{
    const txt = Array.from(r.cells).slice(0,5).map(td=>td.innerText).join(" | ");
    doc.text(txt, 14, y);
    y+=6; if(y>280){ doc.addPage(); y=16; }
  });
  doc.save("resumes.pdf");
};

// Manage Links
const linksTable = document.getElementById('linksTable').querySelector('tbody');

async function refreshLinks(){
  const snap = await db.collection('links').orderBy('createdAt','desc').limit(200).get();
  linksTable.innerHTML = "";
  snap.forEach(doc=>{
    const l = doc.data();
    const shortUrl = `${location.origin}${location.pathname.replace(/\/[^\/]*$/,'')}/s/?c=${l.code}`;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${l.code}</td><td>${l.ownerUserId||l.ownerUid}</td><td>${l.title||''}</td>
      <td>${l.longUrl}</td><td><a href="${shortUrl}" target="_blank">${shortUrl}</a></td>
      <td><button class="btn danger" onclick="removeLink('${doc.id}','${l.ownerUid}')">Remove</button></td>
    `;
    linksTable.appendChild(tr);
  });
  makeTableSortable(document.getElementById('linksTable'));
}
refreshLinks();

window.removeLink = async (id)=>{
  if(!confirm("Remove link for this user?")) return;
  await db.collection('links').doc(id)