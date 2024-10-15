// Existing JavaScript
const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");

signupBtn.onclick = () => {
  console.log("Signup button clicked");
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
};

loginBtn.onclick = () => {
  console.log("Login button clicked");
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
};

signupLink.onclick = async () => {
  console.log("Signup link clicked");
  signupBtn.click();
  return false;
};

// Firebase JavaScript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// import { getAuth1, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqvgQod9D6SNvv-A_7cGbwxVdVvR8Js_s",
  authDomain: "smart-kheti-48bc0.firebaseapp.com",
  projectId: "smart-kheti-48bc0",
  storageBucket: "smart-kheti-48bc0.appspot.com",
  messagingSenderId: "1003683066209",
  appId: "1:1003683066209:web:39de1d6b01bac1805ed520",
  measurementId: "G-LR5WFZE7ET"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);


// Submit button
const submit = document.getElementById('submit');
submit.addEventListener("click", async function(event){
    event.preventDefault();

    // Inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert("Account Created");
      // window.location.href = "/dash/index.html";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("ERROR: " + errorMessage);  // Display the error message
    }
});

///sign

const submit1 = document.getElementById('submit1');
submit1.addEventListener("click", async function(event){
    event.preventDefault();

    // Inputs
    const email1 = document.getElementById('email1').value;
    const password1 = document.getElementById('password1').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email1, password1);
      const user = userCredential.user;
      alert("Acount Created");
    // window.location.href = "/dash/index.html";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("ERROR: " + errorMessage);  // Display the error message
    }
});



