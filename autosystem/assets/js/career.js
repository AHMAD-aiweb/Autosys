setPageTitle("Career");

const form = document.getElementById('careerForm');
const msg = document.getElementById('careerMsg');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  msg.textContent="";
  const cv = document.getElementById('cvFile').files[0];
  if(!cv || cv.type!=="application/pdf"){ msg.textContent="Please upload a PDF."; return; }

  const f = Object.fromEntries(new FormData(form).entries());
  if(!isEmail(f.email)) return msg.textContent="Enter a valid email.";
  if(!isPkPhone(f.phone)) return msg.textContent="Enter a valid Pakistan phone.";

  try{
    const id = shortId("CV-");
    const ref = storage.ref().child(`resumes/${id}.pdf`);
    await ref.put(cv);
    const url = await ref.getDownloadURL();

    await db.collection('resumes').doc(id).set({
      id, name:f.name, email:f.email, phone:f.phone, address:f.address,
      experience:f.experience, skills:f.skills, education:f.education,
      portfolio:f.portfolio||"", fileUrl:url, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    msg.textContent = "Application submitted. Thank you!";
    form.reset();
  }catch(err){
    msg.textContent = err.message;
  }
});
