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


// Sample data (you should replace this with your actual data)
const userData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'User Count',
        data: [150, 200, 300, 400, 500, 600, 700],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }]
};

const productSalesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'Product Sales',
        data: [500, 600, 700, 800, 900, 1000, 1100],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }]
};

const paymentMethodsData = {
    labels: ['Credit Card', 'PayPal', 'Stripe', 'Cash'],
    datasets: [{
        label: 'Payment Methods',
        data: [300, 200, 150, 50],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
    }]
};

// Create user count chart
const userCountChart = new Chart(document.getElementById('userCountChart').getContext('2d'), {
    type: 'line',
    data: userData
});

// Create product sales chart
const productSalesChart = new Chart(document.getElementById('productSalesChart').getContext('2d'), {
    type: 'bar',
    data: productSalesData
});

// Create payment methods chart
const paymentMethodsChart = new Chart(document.getElementById('paymentMethodsChart').getContext('2d'), {
    type: 'pie',
    data: paymentMethodsData
});



// Sample data for latest users and payments (replace with your actual data)
const latestUsersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Alice Smith', email: 'alice@example.com' },
    // Add more users here if needed
];

const latestPaymentsData = [
    { transactionId: 'ABC123', amount: '$50', date: '2024-05-10' },
    { transactionId: 'DEF456', amount: '$100', date: '2024-05-09' },
    // Add more payments here if needed
];

// Function to populate latest users table
const populateLatestUsersTable = () => {
    const latestUsersTableBody = document.getElementById('latestUsersTableBody');
    latestUsersData.forEach(user => {
        const row = `<tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                    </tr>`;
        latestUsersTableBody.innerHTML += row;
    });
};

// Function to populate latest payments table
const populateLatestPaymentsTable = () => {
    const latestPaymentsTableBody = document.getElementById('latestPaymentsTableBody');
    latestPaymentsData.forEach(payment => {
        const row = `<tr>
                        <td>${payment.transactionId}</td>
                        <td>${payment.amount}</td>
                        <td>${payment.date}</td>
                    </tr>`;
        latestPaymentsTableBody.innerHTML += row;
    });
};

// Call the functions to populate tables
populateLatestUsersTable();
populateLatestPaymentsTable();




const UserCount= async () => {
    try {
        const url = '/admin/userCount'
        const response = await fetch(url);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            document.getElementById('userCount').textContent = data.UserCount;
        }
        else {
            document.getElementById('userCount').textContent = "data not found";
        }
    } catch (error) {
        console.error("error loading user count", error);
    }
}
UserCount()

const totalPaymentsCount= async () => {
    try {
        const url = '/admin/productSale'
        const response = await fetch(url);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            document.getElementById('productSales').textContent = data.totalPaymentsCount;
        }
        else {
            document.getElementById('productSales').textContent = "data not found";
        }
    } catch (error) {
        console.error("error loading product sales", error);
    }
}

totalPaymentsCount()

const TotalSale = async () => {
    try {
        const url = '/admin/totalSale'
        const response = await fetch(url);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            document.getElementById('totalSales').textContent = data.totalSales;
        }
        else {
            document.getElementById('totalSales').textContent = "data not found";
        }
    } catch (error) {
        console.error("error loading total sale", error);
    }
}

TotalSale()