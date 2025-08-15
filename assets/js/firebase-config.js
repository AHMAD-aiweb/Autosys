<!-- Firebase App (core SDK) -->
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

<!-- Your Firebase config -->
<script>
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1SFpdzDcJ_lfVu1dLo7zgQhqQ6WiwiGE",
  authDomain: "autosys-31e7e.firebaseapp.com",
  projectId: "autosys-31e7e",
  storageBucket: "autosys-31e7e.firebasestorage.app",
  messagingSenderId: "532724704349",
  appId: "1:532724704349:web:58f6bbc554c79d79ef19b4",
  measurementId: "G-MLTN241WJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { auth };

export const storage = getStorage(app);
