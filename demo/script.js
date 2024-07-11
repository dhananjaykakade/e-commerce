// Dummy data for tables
const users = [
    { name: "John Doe", email: "john@example.com", registrationDate: "2024-05-14" },
    { name: "Jane Smith", email: "jane@example.com", registrationDate: "2024-05-15" },
    // Add more data as needed
  ];
  
  // Function to populate the table with user data
  function populateTable() {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";
    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.registrationDate}</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  // Function to update quick stats
  function updateQuickStats() {
    // Dummy data for quick stats
    const totalSales = 1000;
    const totalUsers = users.length;
    document.querySelector("#totalSales").textContent = totalSales;
    document.querySelector("#totalUsers").textContent = totalUsers;
  }
  
  // Function to initialize charts (using Chart.js)
  function initializeCharts() {
    const salesData = [/* Dummy data for sales chart */];
    const salesChart = new Chart(document.getElementById('salesChart'), {
      type: 'line',
      data: {
        labels: /* Labels for X-axis */,
        datasets: [{
          label: 'Sales',
          data: salesData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  
  // Function to initialize the admin panel
  function initializeAdminPanel() {
    populateTable();
    updateQuickStats();
    initializeCharts();
  }
  
  // Initialize the admin panel when the page loads
  document.addEventListener("DOMContentLoaded", initializeAdminPanel);
  