const addToCartBtn = document.getElementById("addToCartBtn");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const quantityInput = document.getElementById("quantity");

let total = 0;

addToCartBtn.addEventListener("click", () => {
    const productName = "Product Name";
    const price = ""
    const quantity = parseInt(quantityInput.value);

    const cartItem = document.createElement("li");
    cartItem.textContent = `${productName} x ${quantity} - $${(price * quantity).toFixed(2)}`;
    cartItems.appendChild(cartItem);

    total += price * quantity;
    totalPrice.textContent = `Total Price: $${total.toFixed(2)}`;

    quantityInput.value = 1;
});
