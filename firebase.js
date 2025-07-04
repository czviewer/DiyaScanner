import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAyhQ_u0aj_TDUQGC0J_Jcq5kzVmIlJrNQ",
  authDomain: "diya-motors-tracker.firebaseapp.com",
  databaseURL: "https://diya-motors-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "diya-motors-tracker",
  storageBucket: "diya-motors-tracker.firebasestorage.app",
  messagingSenderId: "863309961024",
  appId: "1:863309961024:web:000cec3cdfe97aaaf60ca5",
  measurementId: "G-PJK0E9410H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);



