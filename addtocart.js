let cartItemsObjects = [];
let selectedProduct = {};

onload();

function onload() {
    loadItemObject();
    showCartItems();
    totalAmount();
    

    let savedTotalPrice = JSON.parse(localStorage.getItem("totalPrice"));
    if (savedTotalPrice) {
        document.querySelector(".cart-total .sbkatotal").textContent = `final: Rs. ${savedTotalPrice}`;
    }

    document.querySelectorAll(".product-item").forEach(product => {
        let productId = product.getAttribute("data-id");
        let savedTotal = localStorage.getItem(productId + "_totalPrice");

        if (savedTotal) {
            product.querySelector(".product-total").textContent = `Rs. ${savedTotal}`;
        }
    });
};



function loadItemObject() {
    cartItemsObjects = cartItem.map(itemId => {
        for (let i = 0; i < product.length; i++) {
            if (itemId == product[i].id) {
                return product[i];
            }
        }
    });

    cartItemsObjects.forEach(cartItem => {
        let quantity = JSON.parse(localStorage.getItem(cartItem.id + "_quantity")) || 1;
        let totalPrice = JSON.parse(localStorage.getItem(cartItem.id + "_totalPrice")) || cartItem.price;
        cartItem.quantity = quantity;
        cartItem.totalPrice = totalPrice;
    });
}

function totalAmount() {
    let container = document.querySelector(".cart-total");

    let totalPrice = 0;
    let mrp = 0;
    let discount = 0;
    const convenienceFee = "Free";

    cartItemsObjects.forEach((cartItems) => {
        let itemTotalPrice = cartItems.price * cartItems.quantity;
        mrp += cartItems.oldPrice * cartItems.quantity; 
        discount += (cartItems.oldPrice - cartItems.price) * cartItems.quantity; 
        totalPrice += itemTotalPrice; 
    });

    let summary = ` 
    <div class="summary">
        <h3>Price Details (Items ${cartItemsObjects.length})</h3>
        <p>Total: Rs. ${mrp}</p>
        <p>Discount: Rs.<del> ${discount}</del></p>
        <p>Delivery: ${convenienceFee}</p>
        <h3 class="sbkatotal">final: Rs. ${totalPrice}</h3>
        <button class="checkout-btn">Place Order</button>
    </div>`;

    container.innerHTML = summary;
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
}

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
    
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
    
    const container = document.querySelector(".cart-total");

    container.innerHTML = ` 
    <div class="summary">
    <h3>Price Details (Items ${document.querySelectorAll(".product-item").length})</h3>
    <p>Total: Rs. ${mrp}</p>
    <p>Discount: Rs.<del> ${discount}</del></p>
    <p>Delivery: ${convenienceFee}</p>
    <h3 class="sbkatotal">final: Rs. ${totalPrice}</h3>
    <button onclick="checkout()" class="checkout-btn">Place Order</button>
    </div>`;
}


function addToCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};
    
    if (!cartItems.includes(itemId.toString())) {
        cartItems.push(itemId.toString());
        quantities[itemId.toString()] = 1; 
        localStorage.setItem(itemId + "_quantity", JSON.stringify(1));
        localStorage.setItem(itemId + "_totalPrice", JSON.stringify(product.find(p => p.id == itemId).price));
        location.reload();
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.setItem("cartQuantities", JSON.stringify(quantities));
        
        updateCartTotal(); 
        showCartItems();  
    } else {
        alert("Item already in cart!");
    }
    
    
}

function showCartItems() {
    let cartContainer = document.querySelector(".products");
    let innerHTML = "";

    if (cartItemsObjects.length === 0) {
        cartContainer.innerHTML = "<p class='cart-empty'>Your cart is empty.</p>";
        document.querySelector(".cart-total").innerHTML = ""; 
        return;
    }

    cartItemsObjects.forEach((cartItem) => {
        innerHTML += generateItemHTML(cartItem);
    });

    cartContainer.innerHTML = innerHTML;

    totalAmount();
}


function removeCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};

    itemId = itemId.toString();
    cartItems = cartItems.filter(cartId => cartId.toString() !== itemId);
    
    delete quantities[itemId];
    localStorage.removeItem(itemId + "_quantity");
    localStorage.removeItem(itemId + "_totalPrice");

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("cartQuantities", JSON.stringify(quantities));
    
    updateCartTotal();

    if (cartItems.length === 0) {
        localStorage.removeItem("totalPrice");
        document.querySelector(".cart-total").innerHTML = "";
    }
    
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    const products = document.querySelectorAll(".product-item");
    document.querySelector(".cart-total").addEventListener("click", function (event) {
        if (event.target.classList.contains("checkout-btn")) {
            checkout();
        }
    });
    
    products.forEach(product => {
        const decreaseBtn = product.querySelector(".decrease");
        const increaseBtn = product.querySelector(".increase");
        const quantityInput = product.querySelector(".quantity-input");
        const priceElement = product.querySelector(".product-price");
        const totalElement = product.querySelector(".product-total");
        const price = parseFloat(priceElement.textContent.replace("Rs .", ""));
        let productId = product.getAttribute("data-id");

        let savedQuantity = JSON.parse(localStorage.getItem(productId + "_quantity"));
        let savedTotal = JSON.parse(localStorage.getItem(productId + "_totalPrice"));
        
        if (savedQuantity) {
            quantityInput.value = savedQuantity;
            totalElement.textContent = `Rs. ${savedTotal}`;
        } else {
            totalElement.textContent = `Rs. ${(price)()}`;
        }
        
        function updateTotal() {
            let quantity = parseInt(quantityInput.value);
            if (quantity < 1) quantity = 1;
            quantityInput.value = quantity;
            let totalPrice = price * quantity;
            totalElement.textContent = `Rs. ${totalPrice}`;

            localStorage.setItem(productId + "_quantity", JSON.stringify(quantity));
            localStorage.setItem(productId + "_totalPrice", JSON.stringify(totalPrice));
            
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

    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));

    const container = document.querySelector(".cart-total");

    if (document.querySelectorAll(".product-item").length === 0) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
    <div class="summary">
        <h3>Price Details (Items ${document.querySelectorAll(".product-item").length})</h3>
        <p>Total: Rs. ${mrp}</p>
        <p>Discount: Rs.<del> ${discount}</del></p>
        <p>Delivery: ${convenienceFee}</p>
        <h3 class="sbkatotal">final: Rs. ${totalPrice}</h3>
        <button class="checkout-btn">Place Order</button>
    </div>
    
    `;

    document.querySelector(".checkout-btn").addEventListener("click", checkout);
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
            <div class="rates">
            <strong class="product-price"><small class="pkr">Rs</small> .${cartItem.price}</strong> 
            <del>Rs. ${cartItem.oldPrice}</del> &nbsp;
            <strong class="discount">${cartItem.discount}</strong>
            </div>
            <p class="return">14 : Days Return Policy. <br> Delivered Within 7 Days.</p>
            </div>
            <div class="quantity-container">
                <button class="quantity-btn decrease">-</button>
                <input type="number" class="quantity-input" value="${quantity}" min="1">
                <button class="quantity-btn increase">+</button>
                </div>
                <div class="product-total">Rs. ${(cartItem.price * quantity)}</div>
                </div>
                </div>`; 
            }

            function goToDetails(productId) {
                let selectedProduct = cartItemsObjects.find(item => item.id == productId);
                if (selectedProduct) {
        localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
        window.location.href = "details.html"; 
    }
}




function checkout() {
    if(cartItemsObjects.length === 0) {
        let checkout = document.querySelector(".checkout-btn");
        checkout.style.background = "red";
        checkout.innerHTML="<i class='bx bxs-cart-alt'></i> &nbsp; Cart Is Empty ";
        return;
    }
    let checkout = document.querySelector(".checkout-btn");
    checkout.style.background = "red";
    checkout.innerHTML="Thanks For Shopping &nbsp; <i class='bx bxs-donate-heart' ></i>";

    
    setTimeout(() => {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartQuantities");
        
        cartItemsObjects.forEach(cartItem => {
            localStorage.removeItem(cartItem.id + "_quantity");
            localStorage.removeItem(cartItem.id + "_totalPrice");
            localStorage.removeItem("totalPrice");
            window.location.href = "index.html";
        });

    }, 700);
}

