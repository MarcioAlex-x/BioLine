
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyDiIVLic_s18atZtBaJmTSNDVjqO_7u1FU",
  authDomain: "turmaterca-d2878.firebaseapp.com",
  databaseURL: "https://turmaterca-d2878-default-rtdb.firebaseio.com",
  projectId: "turmaterca-d2878",
  storageBucket: "turmaterca-d2878.appspot.com",
  messagingSenderId: "179178679657",
  appId: "1:179178679657:web:ad5cb958aec320facc21f8",
  measurementId: "G-492TNV85B3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app, auth}