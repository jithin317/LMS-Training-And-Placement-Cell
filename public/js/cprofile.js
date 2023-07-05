import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  onSnapshot,
  query,
  where,
  getCountFromServer,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const companySelected = document.getElementById("companySelected");
const branchSelected = document.getElementById("branchSelected");
const fetchBtn = document.getElementById("fetchBtn");
const loader = document.getElementById("loader");
const studentList = document.getElementById("studentList");
const message = document.querySelector(".message");
let myAlert = document.querySelector(".toast");
let bsAlert = new bootstrap.Toast(myAlert);
bsAlert._config.delay = 10000;
bsAlert._config.autohide = true;

let compRef = collection(db, "companies");

onSnapshot(compRef, (snapshot) => {
  snapshot.docs.forEach((doc) => {
    companySelected.innerHTML += `<option value="${doc.data().Name}">${doc
      .data()
      .Name.toUpperCase()}</option>`;
  });
});

fetchBtn.addEventListener("click", async () => {
  loader.classList.remove("hide");
  message.previousElementSibling.classList.add("text-bg-warning");
  message.innerText = "Fetching the data.Please Wait . . .";
  bsAlert.show();
  let colRef = query(
    collection(db, "students"),
    where("isPlaced", "==", true),
    where("branch", "==", branchSelected.value)
  );
  let count = 0;
  const countOfDocs = await getCountFromServer(colRef);
  onSnapshot(colRef, (snapshot) => {
    if (snapshot.docs.length < 1) {
      errorMsg();
    }
    snapshot.docs.forEach((docu) => {
      colRef = query(
        collection(db, "students", docu.id, "offerList"),
        where("Name", "==", companySelected.value)
      );
      onSnapshot(colRef, (snap) => {
        let id = 1;
        if (!snap.empty) {
          snap.docs.forEach((data) => {
            studentList.innerHTML = "";
            let docRef = doc(collection(db, "students"), docu.id);
            onSnapshot(docRef, (student) => {
              loader.classList.add("hide");
              studentList.innerHTML += `<tr>
                            <th scope="row">${id++}</th>
                            <td>${student.data().rollNo}</td>
                            <td>${student.data().name}</td>
                            <td>${student.data().branch}</td>
                            <td>${data.data().Role}</td>
                            <td>${data.data().Package}</td>
                            <td>${data.data().Location}</td>
                          </tr>`;
            });
          });
        } else {
          count++;
        }
        if (count === countOfDocs.data().count) {
          errorMsg();
        }
      });
    });
    message.previousElementSibling.classList.remove("text-bg-warning");
    message.previousElementSibling.classList.add("text-bg-success");
    message.innerText = "Fetched the Data";
    bsAlert.show();
  });
});

function errorMsg() {
  studentList.innerHTML = "";
  loader.classList.add("hide");
  message.previousElementSibling.classList.remove("text-bg-warning");
  message.previousElementSibling.classList.add("text-bg-danger");
  message.innerText = "No student selected from the requirements";
  bsAlert.show();
}

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