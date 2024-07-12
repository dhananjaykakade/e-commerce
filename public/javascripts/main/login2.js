const password = document.getElementById("password");
const eyeIcon = document.getElementById("eyeOpen");
const eyeClose = document.getElementById("close");


  eyeClose.addEventListener("click", () => {
    
    eyeClose.style.display = "none";
    eyeIcon.style.display = "block";
    password.setAttribute("type", "password");
  });
  eyeIcon.addEventListener("click", () => {
    eyeIcon.style.display = "none";
    eyeClose.style.display = "block";
    password.setAttribute("type", "text");
  });