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
