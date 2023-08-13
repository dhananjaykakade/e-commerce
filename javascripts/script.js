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
