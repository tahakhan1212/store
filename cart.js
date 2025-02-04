let cartItemsObjects = [];
onload();

function onload() {
    loadItemObject();
    totalAmount();
    showCartItems();
}



function loadItemObject() {
    cartItemsObjects = cartItem.map(itemId => {
        for (let i = 0; i < product.length; i++) {
            if (itemId == product[i].id) {
                return product[i]
            }
        }
    })
}

function showCartItems() {
    let cartContainer = document.querySelector(".products");


    let innerHTML = "";

    console.log(cartItemsObjects);


    if (cartItemsObjects.length === 0) {
        cartContainer.innerHTML = "<p class='cart-empty'>Your cart is empty.</p>";
        return;
    }

    cartItemsObjects.forEach((cartItem) => {
        innerHTML += generateItemHTML(cartItem);

    });
    cartContainer.innerHTML = innerHTML;
}

function removeCart(itemId) {
    cartItem = cartItem.filter((cartId) => cartId !== itemId);
    localStorage.setItem("cartItems", JSON.stringify(cartItem));
    cartcount();
    cartcount2();
    loadItemObject();
    showCartItems();
    totalAmount();
}
    
document.addEventListener("DOMContentLoaded", function () {
    const products = document.querySelectorAll(".product-item");

    products.forEach(product => {
        const decreaseBtn = product.querySelector(".decrease");
        const increaseBtn = product.querySelector(".increase");
        const quantityInput = product.querySelector(".quantity-input");
        const priceElement = product.querySelector(".product-price");
        const totalElement = product.querySelector(".product-total");
        const price = parseInt(priceElement.textContent);

        function updateTotal() {
            let quantity = parseInt(quantityInput.value);
            if (quantity < 1) quantity = 1;
            quantityInput.value = quantity;
            totalElement.textContent = (price * quantity).toLocaleString();
        }

        decreaseBtn.addEventListener("click", function () {
            quantityInput.stepDown();
            if (parseInt(quantityInput.value) < 1) quantityInput.value = 1;
            quantityInput.value = Math.max(1, parseInt(quantityInput.value) - 1 +1);
            updateTotal();
        });

        increaseBtn.addEventListener("click", function () {
            quantityInput.stepUp();
            quantityInput.value = parseInt(quantityInput.value) + 1 -1;
            updateTotal();
        });

        console.log(quantityInput.value);


        quantityInput.addEventListener("input", updateTotal);
    });
});

function totalAmount() {
    let container = document.querySelector(".cart-total");

    let totalPrice = 0;
    let mrp = 0;
    let discount = 0 ;
    const convenienceFee = "Free";
    let totalAmount = 0;

    cartItemsObjects.forEach((cartItems) => {
        mrp += parseFloat(cartItems.price+cartItems.oldPrice);
        discount += parseFloat(cartItems.oldPrice);
        totalPrice += cartItems.price;
    });

    totalAmount = mrp - discount;


    let summary = ` 
    <div class="summary">
        <h3>Price Details (Items ${cartItemsObjects.length})</h3>
        <p>Total: Rs. ${mrp}</p>
        <p>Discount: Rs.<del> ${discount}</del></p>
        <p>Delivery: ${convenienceFee}</p>
        <h3 class="sbkatotal">Total: Rs. ${totalPrice}</h3>
        <button class="checkout-btn" onclick="checkout()">Checkout</button>
    </div> `;

    container.innerHTML = summary;
}

function generateItemHTML(cartItem) {
    return ` 
    <div class="product-item">
        <div class="product-details">
            <span class="close" onclick="removeCart(${cartItem.id})"><i class='bx bx-trash'></i></span>
            <img src="${cartItem.image}" alt="" class="product-img">
            <div class="product-info">
                <div class="product-description">
                    <p>${cartItem.description}</p>
                </div>
                <h2>${cartItem.title}</h2>
                <strong class="product-price">Rs .${cartItem.price}</strong> 
                <del>Rs. ${cartItem.oldPrice}</del> &nbsp;
                <strong class="discount">${cartItem.discount}</strong>
                <span class="rs"></span>
                <span class="product-total"></span>
                <p class="return">14 : Days Return Policy. <br> Delivered Within 7 Days.</p>
            </div>
            <div class="quantity-container">
                <button class="quantity-btn decrease">-</button>
                <input type="number" class="quantity-input" value="1" min="1" id="abc">
                <button class="quantity-btn increase">+</button>
            </div>
        </div>
        </div>`;
        
}

