import { db, storage, auth } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  ref,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

loginCheck();
const stdfName = document.getElementById("firstName");
const stdlName = document.getElementById("lastName");
const stdEmail = document.getElementById("Email");
const stdmobileNo = document.getElementById("mobileNo");
const stdgender = document.getElementsByName("gender");
const stdBranch = document.getElementById("inputBranch");
const std10Cgp = document.getElementById("10cgp");
const std10perc = document.getElementById("10perc");
const std12Cgp = document.getElementById("12cgp");
const std12perc = document.getElementById("12perc");
const stdBperc = document.getElementById("bperc");
const stdBglogs = document.getElementById("bglogs");
const stdDob = document.getElementById("DOB");
const stdRno = document.getElementById("Rno");
const stdAddress = document.getElementById("Address");
const message = document.querySelector(".message");
const submitBtn = document.getElementById("btn");

const colRef = collection(db, "students");

let details;
let myAlert = document.querySelector(".toast");
let bsAlert = new bootstrap.Toast(myAlert);
bsAlert._config.delay = 10000;
bsAlert._config.autohide = true;

document.getElementById("profile").addEventListener("change", (e) => {
  details = e.target.files[0];
});

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let gender;
  let fname = stdfName.value;
  let lname = stdlName.value;
  let email = stdEmail.value;
  let mobile = stdmobileNo.value;
  let roll = stdRno.value;
  let branch = stdBranch.value;
  let cgp10 = std10Cgp.value;
  let perc10 = std10perc.value;
  let cgp12 = std12Cgp.value;
  let perc12 = std12perc.value;
  let blogs = stdBglogs.value;
  let dob = stdDob.value;
  let addr = stdAddress.value;
  let btechPerc = stdBperc.value;
  roll = roll.toLowerCase();
  let storageRef = ref(storage, `images/${roll}.jpg`);
  let uploadTask = uploadBytesResumable(storageRef, details);

  for (let i = 0; i < stdgender.length; i++) {
    if (stdgender[i].checked) gender = stdgender[i].value;
  }

  let studentObj = {
    name: fname + " " + lname,
    rollNo: roll,
    email: email,
    mobile: mobile,
    gender: gender,
    branch: branch,
    cgp10: cgp10,
    cgp12: cgp12,
    perc10: perc10,
    perc12: perc12,
    percBtech: btechPerc,
    backlogs: blogs,
    dateOfBirth: dob,
    address: addr,
    isPlaced: false,
    createdAt: serverTimestamp(),
  };
  try {
    let doc = await addDoc(colRef, studentObj);
    let studentFeeRef = collection(colRef, doc.id, "feeDetails");
    let feeDoc = await addDoc(studentFeeRef, {
      balanceFee: 3000,
      paidFee: 0,
    });
    if (doc) {
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
