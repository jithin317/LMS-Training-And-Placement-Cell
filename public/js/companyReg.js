import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
const cName = document.getElementById("cName");
const cRole = document.getElementById("cRole");
const cPack = document.getElementById("cPack");
const cLoc = document.getElementById("cLoc");
const cSelec = document.getElementById("cSelec");
const cCSE = document.getElementById("cCSE");
const cECE = document.getElementById("cECE");
const cEEE = document.getElementById("cEEE");
const cMECH = document.getElementById("cMECH");
const cCIVIL = document.getElementById("cCIVIL");
const btn = document.getElementById("btn");
const message = document.querySelector(".message");
let myAlert = document.querySelector(".toast");
let bsAlert = new bootstrap.Toast(myAlert);
bsAlert._config.delay = 10000;
bsAlert._config.autohide = true;

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  message.previousElementSibling.classList.add("text-bg-warning");
  message.innerText = "Adding Data";
  bsAlert.show();
  try {
    await setDoc(doc(db, "companies", cName.value), {
      Name: cName.value,
    });
    let docu = collection(db, "companies", cName.value, "data");
    let newAddDoc = await addDoc(docu, {
      Role: cRole.value,
      Package: cPack.value,
      Location: cLoc.value,
      Number_of_Selections: cSelec.value,
      CSE: cCSE.value,
      ECE: cECE.value,
      EEE: cEEE.value,
      MECH: cMECH.value,
      CIVIL: cCIVIL.value,
      createdAt: serverTimestamp(),
    });
    if (newAddDoc) {
      message.previousElementSibling.classList.remove("text-bg-warning");
      message.previousElementSibling.classList.add("text-bg-info");
      message.innerText = "successfully added data";
      bsAlert.show();
    } else {
      message.previousElementSibling.classList.remove("text-bg-info");
      message.previousElementSibling.classList.add("text-bg-danger");
      message.innerText = "there was an error please check credentials";
      bsAlert.show();
    }
  } catch (err) {
    message.previousElementSibling.classList.remove("text-bg-info");
    message.previousElementSibling.classList.add("text-bg-danger");
    message.innerText = err.message;
    bsAlert.show();
  }
  setTimeout(() => {
    window.location.reload();
  }, 3000);
});

// Whenever the user clicks signout he should go to login Page
document.getElementById("signOutBtn").addEventListener("click", () => {
  signOut(auth);
  loginCheck();
});
function loginCheck() {
  onAuthStateChanged(auth, (snapshot) => {
    if (!snapshot) {
      window.location.href = "http://localhost:5500/public/index.html";
    }
  });
}
loginCheck();
