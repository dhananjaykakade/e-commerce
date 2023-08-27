
const products = [
    { name: 'Product 1', details: 'Details for Product 1 that can be very long and wrap onto multiple lines.', price: 100, images: ['product1.jpg', 'product1_2.jpg', 'product1_3.jpg'] },
    { name: 'Product 2', details: '', price: 150, images: ['product2.jpg'] },
    { name: 'Product 3', details: 'Details for Product 3', price: '', images: ['product3.jpg', 'product3_2.jpg'] },
    { name: 'Product 4', details: '', price: '', images: [] },
    // Add more products here...
  ];

  const productList = document.getElementById('product-list');

  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.details || '&nbsp;'}</td>
      <td>${product.price || '&nbsp;'}</td>
      <td>${product.offer_price || '&nbsp;'}</td>
      <td>${product.discount || '&nbsp;'}</td>
      <td class="images-column">${product.images.map(image => `<img src="${image}" alt="Product Image">`).join('')}</td>
      <td><button class="delete-btn">Delete</button></td>
    `;

    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
      row.remove(); // Remove the row when the Delete button is clicked
    });

    productList.appendChild(row);
  });
