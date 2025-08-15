setPageTitle("Settings");
requireAuth();

const form = document.getElementById('pwForm');
const msg = document.getElementById('pwMsg');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  msg.textContent="";
  const current = form.current.value;
  const next = form.next.value;

  try{
    const user = auth.currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, current);
    await user.reauthenticateWithCredential(cred);
    await user.updatePassword(next);
    msg.textContent = "Password updated successfully.";
    form.reset();
  }catch(err){
    msg.textContent = err.message;
  }
});
