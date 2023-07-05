import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  RecaptchaVerifier,
  updateProfile,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
const empverifyBtn = document.querySelector("#empverifyBtn");
const stuverifyBtn = document.querySelector("#stuverifyBtn");
const empsubmitBtn = document.querySelector("#empsubmitBtn");
const stusubmitBtn = document.querySelector("#stusubmitBtn");
const message = document.querySelector(".message");
const otpText = document.querySelectorAll("#OTP");
const phnNo = document.querySelector("#phn");
const rollNo = document.querySelector("#rollNo");
const countryCode = document.querySelector("#countryCode");
const captchaContainer = document.querySelectorAll("#captcha");
const otpDiv = document.getElementsByClassName("otp");

let otpFetch = false;
let myAlert = document.querySelector(".toast");
let bsAlert = new bootstrap.Toast(myAlert);
bsAlert._config.delay = 10000;
bsAlert._config.autohide = true;

// Employee authentication open
empsubmitBtn.addEventListener("click", () => {
  if (otpFetch) {
    window.location.href = "http://localhost:5500/public/src/home.html";
  }
  window.recaptchaVerifier = new RecaptchaVerifier(
    captchaContainer[1],
    { size: "invisible" },
    auth
  );
  window.recaptchaVerifier.render().then((widgetID) => {
    window.recaptchaID = widgetID;
  });
  let mobileNo = phnNo.value;
  let cCode = countryCode.value;
  bsAlert.show();
  message.innerText = "We are sending a token to your number. Please wait ...";
  message.previousElementSibling.classList.add("text-bg-info");
  otpDiv[1].classList.remove("hide");
  signInWithPhoneNumber(auth, cCode + mobileNo, window.recaptchaVerifier)
    .then((result) => {
      message.innerText = "We've sent a OTP to your mobile...Please Check";
      message.previousElementSibling.classList.remove("text-bg-info");
      message.previousElementSibling.classList.add("text-bg-warning");
      window.confirmationResult = result;
    })
    .catch((error) => {
      message.innerText = (error.code + "").toUpperCase();
      message.previousElementSibling.classList.add("text-bg-danger");
    });
});

empverifyBtn.addEventListener("click", () => {
  otpFetch = true;
  message.innerText = "Verifying.Please Wait...";
  bsAlert.show();
  window.confirmationResult
    .confirm(otpText[1].value)
    .then((result) => {
      message.innerText = "Verified.Please Click On Submit";
      message.previousElementSibling.classList.remove("text-bg-warning");
      message.previousElementSibling.classList.add("text-bg-success");
      otpDiv[1].classList.add("hide");
    })
    .catch((error) => {
      message.innerText = (error.code + "").toUpperCase();
      message.previousElementSibling.classList.add("text-bg-danger");
    });
});
// Employee authentication close

// Student authentication open
stusubmitBtn.addEventListener("click", async () => {
  let mobileNo;
  let id;
  let colRef = collection(db, "students");
  let sturollNo = rollNo.value;
  let student = query(colRef, where("rollNo", "==", sturollNo));
  await onSnapshot(student, (snapshot) => {
    mobileNo = +snapshot.docs[0].data().mobile;
    id = snapshot.docs[0].id;
  });
  bsAlert.show();
  message.innerText = "We are sending a token to your number. Please wait ...";
  message.previousElementSibling.classList.add("text-bg-info");

  if (otpFetch) {
    console.log(auth.currentUser);
    // updateProfile(auth.currentUser, {
    //   uid: id,
    // });
    // window.location.href = `http://localhost:5500/public/src/studentPage.html?rollNo=${sturollNo}`;
    console.log(auth.currentUser);
  }
  window.recaptchaVerifier = new RecaptchaVerifier(
    captchaContainer[0],
    { size: "invisible" },
    auth
  );
  window.recaptchaVerifier.render().then((widgetID) => {
    window.recaptchaID = widgetID;
  });
  otpDiv[0].classList.remove("hide");
  function checkLogin() {
    if (mobileNo) {
      signInWithPhoneNumber(auth, "+" + 91 + mobileNo, window.recaptchaVerifier)
        .then((result) => {
          message.innerText = "We've sent a OTP to your mobile...Please Check";
          message.previousElementSibling.classList.remove("text-bg-info");
          message.previousElementSibling.classList.add("text-bg-warning");
          window.confirmationResult = result;
        })
        .catch((error) => {
          message.innerText = (error.code + "").toUpperCase();
          message.previousElementSibling.classList.add("text-bg-danger");
        });
    }
  }
  setTimeout(() => {
    checkLogin();
  }, 2000);
});

stuverifyBtn.addEventListener("click", () => {
  otpFetch = true;
  message.innerText = "Verifying.Please Wait...";
  bsAlert.show();
  window.confirmationResult
    .confirm(otpText[0].value)
    .then((result) => {
      message.innerText = "Verified.Please Click On Submit";
      message.previousElementSibling.classList.remove("text-bg-warning");
      message.previousElementSibling.classList.add("text-bg-success");
      otpDiv[0].classList.add("hide");
    })
    .catch((error) => {
      message.innerText = (error.code + "").toUpperCase();
      message.previousElementSibling.classList.add("text-bg-danger");
    });
});

// Student authentication close
