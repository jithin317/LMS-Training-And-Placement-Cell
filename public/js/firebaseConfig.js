import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCCr70wS7YfCewU_WUw72GwT_ArBb3V_Ro",
  authDomain: "studentappform.firebaseapp.com",
  projectId: "studentappform",
  storageBucket: "studentappform.appspot.com",
  messagingSenderId: "784450981229",
  appId: "1:784450981229:web:31ad3f1c8ad33029f6de64",
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);