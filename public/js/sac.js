import { db, storage, auth } from "./firebaseConfig.js";
import {
  collection,
  onSnapshot,
  addDoc,
  where,
  query,
  doc,
  updateDoc,
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
const submitBtn = document.getElementById("submitBtn");
const message = document.querySelector(".message");
const stuName = document.getElementById("stuName");
const stuRoll = document.getElementById("stuRoll");
const Email = document.getElementById("Email");
const mobileNo = document.getElementById("mobileNo");
const inputBranch = document.getElementById("inputBranch");
const stucgp10 = document.getElementById("10cgp");
const stuperc10 = document.getElementById("10perc");
const stucgp12 = document.getElementById("12cgp");
const stuperc12 = document.getElementById("12perc");
const stupercB = document.getElementById("bperc");
const bglogs = document.getElementById("bglogs");
const studentPic = document.getElementById("studentPic");
const cName = document.getElementById("cName");
const cRole = document.getElementById("cRole");
const cPack = document.getElementById("cPack");
const cLoc = document.getElementById("cLoc");
const mainForm = document.getElementById("mainForm");
let myAlert = document.querySelector(".toast");
let bsAlert = new bootstrap.Toast(myAlert);
bsAlert._config.delay = 7000;
bsAlert._config.autohide = true;

const colRef = collection(db, "students");

let stuRef;
let eleID;
searchBtn.addEventListener("click", async () => {
  message.previousElementSibling.classList.add("text-bg-warning");
  message.innerText = "Getting student details. Please Wait";
  bsAlert.show();
  mainForm.classList.remove("hide");
  let rollNo = stuRoll.value.toLowerCase();
  const storageRef = ref(storage, `images/${rollNo}.jpg`);
  try {
    stuRef = await query(colRef, where("rollNo", "==", rollNo));
    const downloadURL = await getDownloadURL(storageRef);

    onSnapshot(stuRef, (snapshot) => {
      let data = snapshot.docs[0].data();
      stuName.value = data.name;
      Email.value = data.email;
      mobileNo.value = data.mobile;
      inputBranch.value = data.branch;
      stucgp10.value = data.cgp10;
      stucgp12.value = data.cgp12;
      stuperc10.value = data.perc10;
      stuperc12.value = data.perc12;
      stupercB.value = data.percBtech;
      bglogs.value = data.backlogs;
      studentPic.setAttribute("src", downloadURL);
      message.previousElementSibling.classList.remove("text-bg-warning");
      message.previousElementSibling.classList.add("text-bg-success");
      message.innerText = "Fetched Successfully";
    });
  } catch (err) {
    message.innerText = err.message;
  }
  await onSnapshot(stuRef, (snapshot) =>
    snapshot.docs.forEach((ele) => {
      eleID = ele.id;
    })
  );
});

onSnapshot(collection(db, "companies"), (snapshot) => {
  snapshot.docs.forEach((ele) => {
    cName.innerHTML += `<option value="${ele.data().Name}">${ele
      .data()
      .Name.toUpperCase()}</option>`;
  });
});

cName.addEventListener("change", (e) => {
  let companyData = collection(db, "companies", e.target.value, "data");
  onSnapshot(companyData, (snapshot) => {
    snapshot.docs.forEach((ele) => {
      cRole.innerHTML += `<option value = ${ele.id}>${ele
        .data()
        .Role.toUpperCase()}</option>`;
    });
  });
});

cRole.addEventListener("change", (e) => {
  let docRef = doc(db, "companies", cName.value, "data", e.target.value);
  onSnapshot(docRef, (snapshot) => {
    cPack.innerHTML = `<option value = ${snapshot.data().Package} selected>${
      snapshot.data().Package
    }</option>`;
    cLoc.innerHTML = `<option value = ${
      snapshot.data().Location
    } selected>${snapshot.data().Location.toUpperCase()}</option>`;
  });
});

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let stdName = stuName.value;
  let stdEmail = Email.value;
  let stdMob = mobileNo.value;
  let stdBranch = inputBranch.value;
  let std10cgp = stucgp10.value;
  let std12cgp = stucgp12.value;
  let std10perc = stuperc10.value;
  let std12perc = stuperc12.value;
  let stdBperc = stupercB.value;
  let stdbglogs = bglogs.value;

  let updatedDoc = updateDoc(doc(db, "students", eleID), {
    name: stdName,
    email: stdEmail,
    mobile: stdMob,
    branch: stdBranch,
    cgp10: std10cgp,
    cgp12: std12cgp,
    perc10: std10perc,
    perc12: std12perc,
    percBtech: stdBperc,
    backlogs: stdbglogs,
    isPlaced: true,
  });

  onSnapshot(
    doc(db, "companies", cName.value, "data", cRole.value),
    async (snapshot) => {
      let colRef = collection(db, "students", eleID, "offerList");
      await addDoc(colRef, {
        Name: cName.value,
        Role: snapshot.data().Role,
        Package: cPack.value,
        Location: cLoc.value,
      });
    }
  );
  if (updatedDoc != null) {
    message.previousElementSibling.classList.add("text-bg-info");
    message.innerText = "successfully updated data";
    bsAlert.show();
  } else {
    message.previousElementSibling.classList.remove("text-bg-info");
    message.previousElementSibling.classList.add("text-bg-danger");
    message.innerText = "there was an error !!";
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
