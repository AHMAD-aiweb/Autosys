// Active nav highlighting
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    if(a.getAttribute('href')===path) a.classList.add('active');
  });
})();

// Footer admin login reveal
(function(){
  const adminLink = document.getElementById('adminLink');
  const modal = document.getElementById('adminModal');
  const closeBtn = document.getElementById('adminModalClose');
  const form = document.getElementById('adminLoginForm');

  if(adminLink){
    adminLink.addEventListener('click', e=>{
      e.preventDefault(); modal.classList.add('show');
    });
  }
  if(closeBtn){ closeBtn.onclick = ()=> modal.classList.remove('show'); }
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const pw = form.password.value.trim();
      if(pw==="123"){
        sessionStorage.setItem('isAdmin','1');
        modal.classList.remove('show');
        location.href = "admin.html";
      }else{
        alert("Incorrect admin password.");
      }
    });
  }
})();

// Sign out
async function doSignOut(){
  await auth.signOut();
  sessionStorage.removeItem('isAdmin');
  location.href="index.html";
}

// Protect private pages (except About/Terms/Contact)
(function(){
  const publicPages = ["index.html","signup.html","about.html","terms.html","contact.html","admin.html","s/index.html"];
  const current = location.pathname.split('/').pop() || 'index.html';
  if(!publicPages.includes(current)){
    requireAuth(true);
  }
})();

// Topbar user greeting
auth.onAuthStateChanged(async (user)=>{
  const nameEl = document.getElementById('topGreeting');
  if(nameEl && user){
    const doc = await db.collection('users').doc(user.uid).get();
    const first = doc.exists ? (doc.data().firstName||"") : "";
    nameEl.textContent = first ? `Hi ${first}` : "Hi there";
  }
});

// SEO helpers
function setPageTitle(title){
  document.title = `${title} · AutoSystem`;
}
