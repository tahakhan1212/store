let cartItemsObjects = [];
let selectedProduct = {};

onload();

function onload() {
    loadItemObject();
    totalAmount();
    showCartItems();
    
    // Initialize the prices from localStorage for each item
    document.querySelectorAll(".product-item").forEach(product => {
        let productId = product.getAttribute("data-id");
        let savedTotal = localStorage.getItem(productId + "_totalPrice");
        
        if (savedTotal) {
            product.querySelector(".product-total").textContent = `Rs. ${savedTotal}`;
        }
    });
}

function loadItemObject() {
    cartItemsObjects = cartItem.map(itemId => {
        for (let i = 0; i < product.length; i++) {
            if (itemId == product[i].id) {
                return product[i];
            }
        }
    });
}

function totalAmount() {
    let container = document.querySelector(".cart-total");

    let totalPrice = 0;
    let mrp = 0;
    let discount = 0;
    const convenienceFee = "Free";
    let totalAmount = 0;

    cartItemsObjects.forEach((cartItems) => {
        mrp += parseFloat(cartItems.price + cartItems.oldPrice);
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
        <button class="checkout-btn">Place Order</button>
    </div> `;

    container.innerHTML = summary;
}

function addToCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []; 
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};

    if (!cartItems.includes(itemId.toString())) { 
        cartItems.push(itemId.toString());
        quantities[itemId.toString()] = 1;  
        alert("Product added to cart!");
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.setItem("cartQuantities", JSON.stringify(quantities));
        location.reload();
    } else {
        alert("Item already in cart!");
    }
}

function showCartItems() {
    let cartContainer = document.querySelector(".products");
    let innerHTML = "";

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
    let cartItem = JSON.parse(localStorage.getItem("cartItems")) || []; 
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};
    
    itemId = itemId.toString();
    cartItem = cartItem.filter(cartId => cartId.toString() !== itemId);
    delete quantities[itemId];  

    localStorage.setItem("cartItems", JSON.stringify(cartItem));
    localStorage.setItem("cartQuantities", JSON.stringify(quantities));

    loadItemObject();
    showCartItems();
    totalAmount();
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    const products = document.querySelectorAll(".product-item");

    products.forEach(product => {
        const decreaseBtn = product.querySelector(".decrease");
        const increaseBtn = product.querySelector(".increase");
        const quantityInput = product.querySelector(".quantity-input");
        const priceElement = product.querySelector(".product-price");
        const totalElement = product.querySelector(".product-total");
        const price = parseFloat(priceElement.textContent.replace("Rs .", ""));
        let productId = product.getAttribute("data-id");

        let savedQuantity = localStorage.getItem(productId + "_quantity");
        let savedTotal = localStorage.getItem(productId + "_totalPrice");

        if (savedQuantity) {
            quantityInput.value = savedQuantity;
            totalElement.textContent = `Rs. ${savedTotal}`;
        } else {
            totalElement.textContent = `Rs. ${(price).toLocaleString()}`;
        }

        function updateTotal() {
            let quantity = parseInt(quantityInput.value);
            if (quantity < 1) quantity = 1;
            quantityInput.value = quantity;
            let totalPrice = price * quantity;
            totalElement.textContent = `Rs. ${totalPrice.toLocaleString()}`;

            // Update localStorage for quantity and totalPrice
            localStorage.setItem(productId + "_quantity", quantity);
            localStorage.setItem(productId + "_totalPrice", totalPrice);

            updateCartTotal(); 
        }

        decreaseBtn.addEventListener("click", function () {
            quantityInput.stepDown();
            if (parseInt(quantityInput.value) < 1) quantityInput.value = 1;
            updateTotal();
        });

        increaseBtn.addEventListener("click", function () {
            quantityInput.stepUp();
            updateTotal();
        });

        quantityInput.addEventListener("input", updateTotal);
    });
});

let clearbtn = document.querySelector(".checkout-btn");

clearbtn.addEventListener("click", function () {
    if(!cartItemsObjects.length) {
        clearbtn.style.background = "red";
        clearbtn.innerHTML = "Cart is empty";
        return;
    }
    localStorage.clear();
    alert("Your order will be delivered under 10 to 15 days.");
    location.reload();
})

function updateCartTotal() {
    let totalPrice = 0;
    let mrp = 0;
    let discount = 0;
    const convenienceFee = "Free";

    document.querySelectorAll(".product-item").forEach(product => {
        const price = parseFloat(product.querySelector(".product-price").textContent.replace("Rs .", ""));
        const quantity = parseInt(product.querySelector(".quantity-input").value);
        const oldPrice = parseFloat(product.querySelector("del").textContent.replace("Rs. ", ""));

        mrp += oldPrice * quantity;
        discount += (oldPrice - price) * quantity;
        totalPrice += price * quantity;
    });

    const container = document.querySelector(".cart-total");
    container.innerHTML = ` 
    <div class="summary">
        <h3>Price Details (Items ${document.querySelectorAll(".product-item").length})</h3>
        <p>Total: Rs. ${mrp}</p>
        <p>Discount: Rs.<del> ${discount}</del></p>
        <p>Delivery: ${convenienceFee}</p>
        <h3 class="sbkatotal">Total: Rs. ${totalPrice}</h3>
        <button class="checkout-btn">Place Order</button>
    </div>`;
}

function generateItemHTML(cartItem) {
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};
    let quantity = quantities[cartItem.id.toString()] || 1; 

    return ` 
    <div class="product-item" data-id="${cartItem.id}">
        <div class="product-details">
            <span class="close" onclick="removeCart(${cartItem.id})"><i class='bx bx-trash'></i></span>
            <img src="${cartItem.image}" alt="" class="product-img" onclick="goToDetails(${cartItem.id})">
            <div class="product-info">
                <div class="product-description">
                    <p>${cartItem.description}</p>
                </div>
                <h2>${cartItem.title}</h2>
                <strong class="product-price">Rs .${cartItem.price}</strong> 
                <del>Rs. ${cartItem.oldPrice}</del> &nbsp;
                <strong class="discount">${cartItem.discount}</strong>
                <p class="return">14 : Days Return Policy. <br> Delivered Within 7 Days.</p>
            </div>
            <div class="quantity-container">
                <button class="quantity-btn decrease">-</button>
                <input type="number" class="quantity-input" value="${quantity}" min="1">
                <button class="quantity-btn increase">+</button>
            </div>
            <div class="product-total">Rs. ${(cartItem.price * quantity).toLocaleString()}</div>
        </div>
    </div>`;
}

function updateQuantityInLocalStorage(productId, quantity) {
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};
    quantities[productId] = quantity;
    localStorage.setItem("cartQuantities", JSON.stringify(quantities));
}

function goToDetails(productId) {
    let selectedProduct = cartItemsObjects.find(item => item.id == productId);
    if (selectedProduct) {
        localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
        window.location.href = "details.html"; 
    }
}
