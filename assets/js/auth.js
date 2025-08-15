// Login.js or Signup.js
import { auth } from "./firebase"; // adjust path as needed
import { signInWithEmailAndPassword } from "firebase/auth";

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in!");
  } catch (error) {
    console.error("Login error:", error.message);
  }
};

// Handle Sign In
const signInForm = document.getElementById('signInForm');
if(signInForm){
  setPageTitle("Sign In");
  signInForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = signInForm.email.value.trim();
    const password = signInForm.password.value;
    const msg = document.getElementById('signInMsg');
    msg.textContent = "";
    try{
      await auth.signInWithEmailAndPassword(email,password);
      location.href="main.html";
    }catch(err){
      msg.textContent = err.message;
    }
  });
}

// Handle Sign Up
const signUpForm = document.getElementById('signUpForm');
if(signUpForm){
  setPageTitle("Sign Up");
  signUpForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const f = Object.fromEntries(new FormData(signUpForm).entries());
    const msg = document.getElementById('signUpMsg');
    msg.textContent = "";

    if(!isEmail(f.email)) return msg.textContent="Please enter a valid email.";
    if(!isPkPhone(f.phone)) return msg.textContent="Enter a valid Pakistan phone like 03XXXXXXXXX or +923XXXXXXXXX.";

    try{
      const cred = await auth.createUserWithEmailAndPassword(f.email, f.password);
      const uid = cred.user.uid;
      const myUserId = shortId("U-"); // unique display User ID
      const mk = monthKey();

      await db.collection('users').doc(uid).set({
        uid, userId: myUserId, role: "user",
        firstName: f.firstName, lastName: f.lastName, email: f.email,
        phone: f.phone, address: f.address, gender: f.gender,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        monthKey: mk, monthlyClicks: 0, totalClicks: 0,
        countryCounts: {}, monthlyCountryCounts: {}
      });

      msg.textContent = "Account created. Redirecting...";
      setTimeout(()=> location.href="main.html", 700);
    }catch(err){
      msg.textContent = err.message;
    }
  });
}

