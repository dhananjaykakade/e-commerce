// var x = document.getElementById("login");
// var y = document.getElementById("register");
// var z = document.getElementById("btn");
// function register() {
//   x.style.left = "-400px";
//   y.style.left = "50px";
//   z.style.left = "110px";
// }
// function login() {
//   x.style.left = "50px";
//   y.style.left = "450px";
//   z.style.left = "0px";
// }


// z.addEventListener("click", () => {
//   z.style.left = "110px";
// });


var Form = document.getElementById("register")
var RegisterErr = document.getElementById("submit-err-register");

var NameErr = document.getElementById("name-err-register");
var PassErr = document.getElementById("pass-err-register");
var EmailErr = document.getElementById("email-err-register");

function validatname() {
  var name = document.getElementById("name").value;
  if (name.length == 0) {
    NameErr.style.color = "red";
    NameErr.innerHTML = "please enter name";
    return false;
  }
  NameErr.style.color = "green";
  NameErr.style.animation = "none";
  NameErr.innerHTML = "valid name";
  return true;
}

function validatePassword() {
  var password = document.getElementById("password").value;

  if (password.length < 8) {
    PassErr.style.color = "red";
    PassErr.innerHTML = "Please enter a valid password with at least 8 characters";
    return false;
  }

  PassErr.style.color = "green";
  PassErr.style.animation = "none";
  PassErr.innerHTML = "Valid password";
  return true;
}

function validatemail() {
  var email = document.getElementById("email").value;
  if (email.length == 0) {
    EmailErr.style.color = "red";
    EmailErr.innerHTML = "please enter valid email ";
    return false;
  }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    EmailErr.style.color = "red";
    EmailErr.innerHTML = "Please enter a valid email address";
    return false;
  }
  EmailErr.style.animation = "none";
  EmailErr.style.color = "green";
  EmailErr.innerHTML = "valid mail";
  return true;
}

function validateform() {
  if (!validatname() || !validatemail() || !validatePassword()) {
    RegisterErr.style.color = "red";
    RegisterErr.style.display = "block";
    RegisterErr.innerHTML = "please check the details ";
    setTimeout(function () {
      RegisterErr.style.display = "none";
    }, 3000);
    return false;
  }
  RegisterErr.style.animation = "none";
  RegisterErr.style.color = "green";
  RegisterErr.style.display = "block";
  RegisterErr.innerHTML = "successfully submitted ";
  setTimeout(function () {
    RegisterErr.style.display = "none";
  }, 8000);
  return true;
}

let submitBt = document.getElementById("submitBt");

submitBt.onclick = function () {
  if (!validateform()) {
    console.log("Validation failed");
    return false;
  }
  console.log("Validation passed");
  return true;
};