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
    </div>`;
}


let isAddingToCart = false; 

function addToCart(itemId) {
    if (isProcessing) return;  

    let button = document.querySelector(`.container[data-id="${itemId}"] .like`);
    let selectedProduct = product.find(p => p.id == itemId);

    isProcessing = true;
    button.classList.add("loading");
    button.innerHTML = `<div class="spinner"></div>`;

    showPopup(selectedProduct, () => {
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};

        if (!cartItems.includes(itemId.toString())) {
            cartItems.push(itemId.toString());
            quantities[itemId.toString()] = (quantities[itemId.toString()] || 0) + 1;

            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            localStorage.setItem("cartQuantities", JSON.stringify(quantities));
            localStorage.setItem(itemId + "_quantity", JSON.stringify(quantities[itemId.toString()]));
            localStorage.setItem(itemId + "_totalPrice", JSON.stringify(selectedProduct.price));

            cartItem = cartItems;
            cartcount();
            cartcount2();
            updateCartUI();
            loadItemObject();
        }

        button.innerHTML = `<i class="bx bx-check-circle added"></i>`;
        button.classList.remove("loading");
        button.classList.add("added-to-cart");
        button.disabled = true;
        
        isProcessing = false;
    });
}



function updateCartUI() {
    showCartItems();  
    updateCartTotal();
    
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    let cartCountElement = document.querySelector(".cart-count");
    let cartCountElement2 = document.querySelector(".cart-count2"); 

    if (cartCountElement) {
        cartCountElement.textContent = cartItems.length;
        cartCountElement.style.display = cartItems.length > 0 ? "block" : "none";
    }

    if (cartCountElement2) {
        cartCountElement2.textContent = cartItems.length;
        cartCountElement2.style.display = cartItems.length > 0 ? "block" : "none";
    }

    updateCheckoutButton(); 
    
}



function showCartItems() {
    let cartContainer = document.querySelector(".products");
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const cartCountElement = document.querySelector(".cart-count");
    cartCountElement.textContent = cartItems.length;
    
    if (cartItems.length === 0) {
        cartCountElement.style.display = "none";
    } else {
        cartCountElement.style.display = "block";
    }

    if (cartItems.length === 0) {
        cartContainer.innerHTML = "<p class='cart-empty'>Your cart is empty.</p>";
        document.querySelector(".cart-total").innerHTML = ""; 
        updateCheckoutButton();  
        return;
    }

    cartContainer.innerHTML = ""; 

    cartItems.forEach(itemId => {
        let cartItem = product.find(p => p.id == itemId);
        if (cartItem) {
            cartContainer.innerHTML += generateItemHTML(cartItem);
        }
    });

    totalAmount();
    initializeQuantityButtons();  
    updateCheckoutButton(); 
    
}




function removeCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};

    if (!cartItems.includes(itemId.toString())) {
        return;
    }

    itemId = itemId.toString();
    cartItems = cartItems.filter(cartId => cartId !== itemId);
    delete quantities[itemId];

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("cartQuantities", JSON.stringify(quantities));

    showCartItems();
    updateCartTotal();
    updateCartUI();

    let button = document.querySelector(`.container[data-id="${itemId}"] .like`);
    if (button) {
        button.innerHTML = `<i class='bx bxs-cart-alt'></i>`;
        button.disabled = false;
    }
}




function initializeQuantityButtons() {
    document.querySelectorAll(".product-item").forEach(product => {
        const decreaseBtn = product.querySelector(".decrease");
        const increaseBtn = product.querySelector(".increase");
        const quantityInput = product.querySelector(".quantity-input");
        const priceElement = product.querySelector(".product-price");
        const totalElement = product.querySelector(".product-total");
        const price = parseFloat(priceElement.textContent.replace("Rs .", ""));
        let productId = product.getAttribute("data-id");

        let savedQuantity = JSON.parse(localStorage.getItem(productId + "_quantity")) || 1;
        quantityInput.value = savedQuantity;

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
            <img src="${cartItem.image}" " loading="lazy" alt="" class="product-img" onclick="goToDetails(${cartItem.id})">
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

function updateCheckoutButton() {
    let checkout = document.querySelector(".checkout-btn");
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    

    if (cartItems.length === 0) {
        checkout.style.background = "red";
        checkout.innerHTML = "Cart Is Empty &nbsp; <i class='bx bxs-cart-alt'></i>";
        checkout.style.color = "var(--body-color)";
    } else {
        checkout.style.background = "darkorange";
        checkout.innerHTML = "Place Order &nbsp; <i class='bx bxs-check-circle'></i>";
        checkout.style.color = "var(--text-color)";
        checkout.disabled = false;
    }
}

document.querySelector(".checkout-btn").addEventListener("click", function() {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    if (cartItems.length === 0) {
        let checkoutBtn = document.querySelector(".checkout-btn");
        checkoutBtn.classList.add("shake");
        checkoutBtn.innerHTML = "Cart Is Empty &nbsp; <i class='bx bx-error'></i>";

        setTimeout(() => {
            checkoutBtn.classList.remove("shake");
        }, 500);
    }
});


function checkout() {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cartItems.length >= 1) {
    let checkout = document.querySelector(".checkout-btn");
    checkout.style.background = "var(--extra-color)";
    checkout.style.color = "var(--text-color)";
    checkout.innerHTML = "Thanks For Shopping &nbsp; <i class='bx bxs-donate-heart'></i>";

    setTimeout(() => {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("cartQuantities");

        cartItems.forEach(cartItemId => {
            localStorage.removeItem(cartItemId + "_quantity");
            localStorage.removeItem(cartItemId + "_totalPrice");
        });

        localStorage.removeItem("totalPrice");
        window.location.href = "index.html";

    }, 700);
}
}



