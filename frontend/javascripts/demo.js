// script.js
document.addEventListener("DOMContentLoaded", () => {
    // Add an event listener to handle role changes and saves
    const table = document.querySelector("table");
    table.addEventListener("click", (event) => {
        if (event.target.classList.contains("save-button")) {
            const row = event.target.closest("tr");
            const select = row.querySelector("select");
            const selectedRole = select.value;

            // Here, you can implement code to save the selected role
            // For demonstration purposes, we'll log the selected role to the console
            console.log(`Saved role for user: ${selectedRole}`);
        }
    });
});
