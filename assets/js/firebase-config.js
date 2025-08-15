<!-- Firebase App (core SDK) -->
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>

<!-- Add other Firebase SDKs you need -->
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js"></script>

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

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);