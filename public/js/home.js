import { auth, db } from "./firebaseConfig.js";

import {
  collection,
  onSnapshot,
  where,
  query,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
const btn = document.getElementById("signOutBtn");
const placedStudents = document.getElementById("placedList");
const unplacedStudents = document.getElementById("UnplacedList");
const loaders = document.querySelectorAll("#loader");
let obj;

function loginCheck() {
  onAuthStateChanged(auth, (snapshot) => {
    if (!snapshot) {
      window.location.href = "http://localhost:5500/public/index.html";
    }
  });
}

btn.addEventListener("click", () => {
  signOut(auth);
});

let colRef = collection(db, "students");
let placedList = query(colRef, where("isPlaced", "==", true));
let unPlacedList = query(colRef, where("isPlaced", "==", false));


console.log(auth)
onSnapshot(placedList, (snapshot) => {
  let id = 1;
  loaders[0].classList.add("hide");
  snapshot.docs.forEach((doc) => {
    placedStudents.innerHTML += `<tr>
    <th scope="row">${id++}</th>
    <td><a class="link-offset-2 link-dark link-underline link-underline-opacity-0" href = "http://localhost:5500/public/src/studentPage.html?rollNo=${
      doc.data().rollNo
    }">${doc.data().rollNo}</a></td>
    <td>${doc.data().name}</td>
    <td>${doc.data().branch}</td>
  </tr>`;
  });
});

onSnapshot(unPlacedList, (snapshot) => {
  let id = 1;
  loaders[1].classList.add("hide");
  snapshot.docs.forEach((doc) => {
    unplacedStudents.innerHTML += `<tr>
    <th scope="row">${id++}</th>
    <td>${doc.data().rollNo}</td>
    <td>${doc.data().name}</td>
    <td>${doc.data().branch}</td>
  </tr>`;
  });
});

loginCheck();
