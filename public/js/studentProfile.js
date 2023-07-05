import { db, storage, auth } from "./firebaseConfig.js";
import {
  collection,
  query,
  where,
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  ref,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const stuEmail = document.getElementById("Email");
const stuName = document.getElementById("stuName");
const stuMobile = document.getElementById("mobileNo");
const stuBranch = document.getElementById("inputBranch");
const stuImage = document.getElementById("studentPic");
const studentDiv = document.getElementById("studentDiv");
const companyDiv = document.getElementById("companyDiv");
const cName = document.getElementById("cName");
const cRole = document.getElementById("cRole");
const cPack = document.getElementById("cPack");
const cLoc = document.getElementById("cLoc");

const urlRollNo = new URLSearchParams(window.location.search).get("rollNo");
let colRef = collection(db, "students");
let studentData = query(colRef, where("rollNo", "==", urlRollNo));

onSnapshot(studentData, (snapshot) => {
  if (!snapshot.empty) {
    snapshot.docs.forEach((document) => {
      console.log(document)
      stuName.value = document.data().name;
      stuEmail.value = document.data().email;
      stuMobile.value = document.data().mobile;
      stuBranch.value = document.data().branch;
      colRef = collection(db, "students", document.id, "offerList");
    });
    onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        snapshot.docs.forEach((document) => {
          cName.innerHTML += `<option value = ${document.id}>${document
            .data()
            .Name.toUpperCase()}</option>`;
        });
      }
      else{
        companyDiv.classList.add('hide')
        studentDiv.classList.remove('hide')
      }
    });
  } else {
    document.getElementById(
      "mainForm"
    ).innerHTML = `<h3>Your Student ID is not Registered in T&P.Kindly check your credentials<h3>`;
    setTimeout(() => {
      signOut(auth);
      loginCheck();
    }, 3000);
  }
});

// When the user changes the company name other details should be autofilled
cName.addEventListener("change", (e) => {
  let docRef = doc(colRef, e.target.value);
  onSnapshot(docRef, (snapshot) => {
    cRole.innerHTML = `<option value = ${snapshot.id}>${snapshot
      .data()
      .Role.toUpperCase()}</option>`;
    cPack.innerHTML = `<option value = ${snapshot.id}>${snapshot
      .data()
      .Package.toUpperCase()}</option>`;
    cLoc.innerHTML = `<option value = ${snapshot.id}>${snapshot
      .data()
      .Location.toUpperCase()}</option>`;
  });
});
console.log(auth)
const storageRef = ref(storage, `images/${urlRollNo}.jpg`);
getDownloadURL(storageRef)
  .then((url) => {
    stuImage.setAttribute("src", url);
  })
  .catch((err) => console.log(err));

// Whenever the user clicks signout he should go to login Page
document.getElementById("signOutBtn").addEventListener("click", () => {
  signOut(auth);
  loginCheck();
});
function loginCheck() {
  onAuthStateChanged(auth, (snapshot) => {
    console.log(snapshot);
    if (!snapshot) {
      window.location.href = "http://localhost:5500/public/index.html";
    }
  });
}
loginCheck();
