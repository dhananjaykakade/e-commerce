function updateUserRole(userId) {
    const userRoleSelect = document.getElementById(`userRole${userId}`);
    const newRole = userRoleSelect.value;

    // Send the updated role to the server using a fetch request
    fetch(`/api/updateUserRole/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server (e.g., display a success message)
        console.log(data);
    })
    .catch(error => {
        // Handle errors
        console.error("Error:", error);
    });
}



const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.left = sidebar.style.left === '0px' ? '-250px' : '0px';
};

document.querySelector('.hamburger-menu').addEventListener('click', toggleSidebar);

// Function to hide/show sidebar based on screen size
const handleSidebarVisibility = () => {
    const screenWidth = window.innerWidth;
    const sidebar = document.querySelector('.sidebar');
    if (screenWidth > 768) {
        sidebar.style.left = '0px'; // Ensure sidebar is always visible on larger screens
    } else {
        // If sidebar is currently hidden and the screen size increases, keep it hidden
        if (sidebar.style.left === '-250px') {
            sidebar.style.left = '-250px';
        }
    }
};

// Call the function initially and add an event listener for window resize
handleSidebarVisibility();
window.addEventListener('resize', handleSidebarVisibility);