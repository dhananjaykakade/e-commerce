// Get the about button and the dropdown content
const aboutButton = document.querySelector('.dropbtn');
const dropdownContent = document.querySelector('.dropdown-content');

// Add a click event listener to the about button
aboutButton.addEventListener('click', () => {
  // Toggle the "open" class to show/hide the dropdown content
  dropdownContent.classList.toggle('open');
});

// Close the dropdown when clicking outside of it
document.addEventListener('click', (event) => {
  if (!aboutButton.contains(event.target)) {
    dropdownContent.classList.remove('open');
  }
});


// *******************************************************************************
var swiper = new Swiper(".mySwiper", {
  effect: "flip",
  grabCursor: true,
  autoplay: {
      delay: 1300,
      disableOnInteraction: false,
    },
  pagination: {
    el: ".swiper-pagination",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});




async function updateLoginStatus() {
  try {
    const response = await fetch('/api/auth/status');
    const data = await response.json();

    if (data.isLoggedIn) {
      // User is logged in, show the logout link and hide the login link
      loginLink.style.display = 'none';
      logoutLink.style.display = 'inline-block'; // or 'block', or 'inline', depending on your styling preference
    } else {
      // User is not logged in, show the login link and hide the logout link
      loginLink.style.display = 'inline-block'; // or 'block', or 'inline', depending on your styling preference
      logoutLink.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching authentication status:', error);
  }
}

// Get references to the login and logout anchor tags
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');

// Call the function to update the UI based on the user's login status
updateLoginStatus();