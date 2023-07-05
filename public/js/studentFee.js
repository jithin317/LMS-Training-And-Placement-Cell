import { db, storage, auth } from "./firebaseConfig.js";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
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

const searchBtn = document.getElementById("searchBtn");
const stuRoll = document.getElementById("stuRoll");
const saveBtn = document.getElementById("saveBtn");
const editBtn = document.getElementById("editBtn");
const submitBtn = document.getElementById("submitBtn");
const feePaid = document.getElementById("feePaid");
const feeBal = document.getElementById("feeBal");
const mainDiv = document.getElementById("mainDiv");
const stuEmail = document.getElementById("Email");
const stuName = document.getElementById("stuName");
const stuMobile = document.getElementById("mobileNo");
const stuBranch = document.getElementById("inputBranch");
const stuImage = document.getElementById("studentPic");

let myAlert = document.querySelector(".toast");
let bsAlert = new bootstrap.Toast(myAlert);
bsAlert._config.delay = 10000;
bsAlert._config.autohide = true;

let colRef = collection(db, "students");
let studentFeeRef;
let eleID;

searchBtn.addEventListener("click", () => {
  let student = query(colRef, where("rollNo", "==", stuRoll.value));
  const storageRef = ref(storage, `images/${stuRoll.value}.jpg`);
  getDownloadURL(storageRef)
    .then((url) => {
      stuImage.setAttribute("src", url);
    })
    .catch((err) => console.log(err));
  onSnapshot(student, (details) => {
    details.docs.forEach((info) => {
      stuEmail.value = info.data().email;
      stuName.value = info.data().name;
      stuBranch.value = info.data().branch;
      stuMobile.value = info.data().mobile;
    });
    studentFeeRef = collection(
      db,
      "students",
      details.docs[0].id,
      "feeDetails"
    );
    onSnapshot(studentFeeRef, (feeDetails) => {
      eleID = feeDetails.docs[0].id;
      let feeInfo = feeDetails.docs[0].data();
      feeBal.innerText = feeInfo.balanceFee;
      localStorage.setItem("feeBalance", JSON.stringify(+feeBal.innerText));
      feePaid.placeholder = "₹" + feeInfo.paidFee;
    });
  });
});

editBtn.addEventListener("click", () => {
  saveBtn.classList.remove("hide");
  editBtn.classList.add("hide");
  feePaid.disabled = false;
});

feePaid.addEventListener("input", (e) => {
  if (+feeBal.innerText == 0) {
    alert("No balance fee");
  } else {
    feeBal.innerText = JSON.parse(localStorage.getItem("feeBalance"));
    feeBal.innerText = +feeBal.innerText - +e.target.value;
  }
});

saveBtn.addEventListener("click", () => {
  editBtn.classList.remove("hide");
  saveBtn.classList.add("hide");
  feePaid.placeholder = "₹" + feePaid.value;
  feePaid.value = "";
  localStorage.setItem("feeBalance", JSON.stringify(+feeBal.innerText));
  feePaid.disabled = true;
  if (+feeBal.innerText === 0) {
    mainDiv.classList.remove("alert-danger");
    mainDiv.classList.remove("alert-warning");
    mainDiv.classList.remove("border-danger");
    mainDiv.classList.remove("border-warning");
    mainDiv.classList.add("border-success");
    mainDiv.classList.add("alert-success");
  } else if (+feeBal.innerText < 3000) {
    mainDiv.classList.remove("alert-danger");
    mainDiv.classList.add("alert-warning");
    mainDiv.classList.remove("border-danger");
    mainDiv.classList.add("border-warning");
  } else {
    mainDiv.classList.add("alert-danger");
  }
});

submitBtn.addEventListener("click", () => {
  let document = doc(studentFeeRef, eleID);
  updateDoc(document, {
    balanceFee: +feeBal.innerText,
    paidFee: 3000 - +feeBal.innerText,
  });
  message.previousElementSibling.classList.add("text-bg-info");
  message.innerText = "successfully updated data";
  bsAlert.show();
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