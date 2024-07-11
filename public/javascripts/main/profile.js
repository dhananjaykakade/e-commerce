const editButton = document.getElementById("Edit");
const updateForm = document.getElementById("updateForm");
const emailInput = document.getElementById("email");
const emailBtn = document.getElementById("EmailBtn");
const emailBtnx = document.getElementById("EmailBtnx");
const submitEmailBtn = document.getElementById("submitemail");

emailBtn.addEventListener("click", (event) => {
  // Show submit button when editing email
  event.preventDefault();
  emailInput.removeAttribute("disabled")
  submitEmailBtn.style.display = "block";
  emailBtn.style.display = "none";
  emailBtnx.style.display = "block";
});
emailBtnx.addEventListener("click", (event) => {
  // Show submit button when editing email
  event.preventDefault();
  emailInput.setAttribute('disabled', 'disabled');
  submitEmailBtn.style.display = "none";
  emailBtn.style.display = "block";
  emailBtnx.style.display = "none";
});

// document
//   .getElementById("updateForm")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();
//     const form = event.target;
//     const formData = new FormData(form);
//     const url = form.getAttribute("action");

//     // Add isEditing parameter to the form data
//     formData.append("isEditing", true);

//     fetch(url, {
//       method: "PUT",
//       body: formData,
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("User profile updated successfully:", data);
//         // Optionally, update UI to reflect changes
//       })
//       .catch((error) => {
//         console.error("There was a problem updating the user profile:", error);
//         // Optionally, display error message to the user
//       });
//   });

// Function to toggle password form visibility
function togglePasswordForm() {
  const passForm = document.getElementById("password-info");
  const passBtn = document.getElementById("toggle");

  if (passForm.style.display === "none") {
    passForm.style.display = "block";
    passBtn.style.display = "none";
  } else {
    passForm.style.display = "none";
    passBtn.style.display = "block";
  }
}

// Function to validate password
const passForm = document.getElementById("password-info");
const passBtn = document.getElementById("toggle");
const update = document.getElementById("updateForm");

passBtn.addEventListener('click',() => {
  passForm.style.display = "block";
  passBtn.style.display = "none";
  update.style.display = "none";
  


})
const xmark = document.getElementById('xmark')
xmark.addEventListener("click",() => {
  passForm.style.display = "none";
  passBtn.style.display = "block";
  update.style.display = "block";
})



function validatePassword() {
  var password = document.getElementById("newPassword").value;
  const PassErr = document.getElementById("passErr");

  if (!password) {
    PassErr.style.color = "red";
    PassErr.innerHTML =
      "Please enter a valid password with at least 8 characters";
    return false;
  }

  if (password.length < 8) {
    PassErr.style.color = "red";
    PassErr.innerHTML = "Password must be at least 8 characters long";
    return false;
  }

  PassErr.style.color = "green";
  PassErr.style.animation = "none";
  PassErr.innerHTML = "Valid password";
  return true;
}

// Event listener for form submission
document
  .getElementById("changePasswordForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const userId = document.getElementById("userId").value;

    // Validate new password
    if (!validatePassword()) {
      return; // Stop form submission if validation fails
    }

    try {
      const response = await fetch(`/change-password/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include any authentication headers if required
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        const result = await response.json();
         alert(result.message)
        // Optionally, clear the password fields
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("changePasswordForm").style.display = "none";
        togglePasswordForm(); // Toggle form visibility
      } else {
        const errorMessage = await response.json();
        
        alert(errorMessage.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred. Please try again later.")
        
    }
  });

// Event listener for password form toggle button


const userBtn = document.getElementById("userBtn");
const userBtnx = document.getElementById("userBtnx");
const user = document.getElementById("username");
const submituser = document.getElementById("submituser");


userBtn.addEventListener("click", (event) => {
  event.preventDefault();
  user.removeAttribute("disabled");
  userBtn.style.display = "none";
  userBtnx.style.display = "block";
  submituser.style.display = "block";
  
});
userBtnx.addEventListener("click", (event) => {
  event.preventDefault();
  user.setAttribute('disabled', 'disabled');
  userBtn.style.display = "block";
  userBtnx.style.display = "none";
  submituser.style.display = "none";
  
});

const nameBtn = document.getElementById("nameBtn");
const nameBtnx= document.getElementById("namex");
const submitname = document.getElementById("submitname");


nameBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const name = document.getElementById("name");

  name.removeAttribute("disabled");
  nameBtn.style.display = "none";
  nameBtnx.style.display = "block";
  submitname.style.display = "block";
});

nameBtnx.addEventListener("click", () => {
  
  const name = document.getElementById("name");
  console.log("working")
  name.setAttribute('disabled', 'disabled');
  nameBtn.style.display = "block";
  nameBtnx.style.display = "none";
  submitname.style.display = "none";
});

const contactBtn = document.getElementById("contactBtn");
const contactBtnx = document.getElementById("contactBtnx");
const contactNumber = document.getElementById("contactNumber");
const submitContact = document.getElementById("submitContact");


contactBtn.addEventListener("click", (event) => {
  event.preventDefault();
  contactNumber.removeAttribute("disabled");
  contactBtn.style.display = "none";
  contactBtnx.style.display = "block";
  submitContact.style.display = "block";
});
contactBtnx.addEventListener("click", (event) => {
  event.preventDefault();
  contactNumber.setAttribute('disabled', 'disabled');
  contactBtn.style.display = "block";
  contactBtnx.style.display = "none";
  submitContact.style.display = "none";
});

const addressBtn = document.getElementById("addressBtn");
const addressBtnx = document.getElementById("addressBtnx");
const address = document.getElementById("address");
const submitaddress = document.getElementById("submitaddress");


addressBtn.addEventListener("click", (event) => {
  event.preventDefault();
  address.removeAttribute("disabled");
  addressBtn.style.display = "none";
  addressBtnx.style.display = "block";
  submitaddress.style.display = "block";
});
addressBtnx.addEventListener("click", (event) => {
  event.preventDefault();
  address.setAttribute('disabled', 'disabled');
  addressBtn.style.display = "block";
  addressBtnx.style.display = "none";
  submitaddress.style.display = "none";
});




function validateContact() {
  const contact = document.getElementById("contactNumber").value;
  const phoneInput =document.getElementById("contactNumber")
  const isValidContact = validatePhoneNumber(contact);
   phoneInput.addEventListener('input', function(event) {
      // Remove any non-numeric characters
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
  });

  if (isValidContact) {
    showSuccess(phoneError);
    return true;
  } else {
    showError(phoneError);
    return false;
  }
}

function validatePhoneNumber(contact) {
  const regex = /^\d{10}$/;
  return regex.test(contact);
}


const getUserRole = async () => {
  const url = "/userRole";
  
  try {
    const response = await fetch(url);
    
    if (response.ok) {
      let link = document.createElement('a')
      let container = document.querySelector('.link-container')
      link.href = "/admin/dashboard";
      link.className= 'link-button'
      link.innerText = "Go to Admin Panel";
      container.appendChild(link);
    } else {
      console.log("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

getUserRole();