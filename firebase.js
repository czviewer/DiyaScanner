// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyAyhQ_u0aj_TDUQGC0J_Jcq5kzVmIlJrNQ",
  authDomain: "diya-motors-tracker.firebaseapp.com",
  databaseURL: "https://diya-motors-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "diya-motors-tracker",
  storageBucket: "diya-motors-tracker.appspot.com",
  messagingSenderId: "863309961024",
  appId: "1:863309961024:web:000cec3cdfe97aaaf60ca5"
};

// Initialize Firebase using compat
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
