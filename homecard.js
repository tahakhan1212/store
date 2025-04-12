let cartItem;
let isProcessing = false;

onload();

function onload() {
    let cartItemsStr = localStorage.getItem("cartItems");
    cartItem = cartItemsStr ? JSON.parse(cartItemsStr) : [];
    displayData();
    cartcount();
    cartcount2();
}

function addToCart(itemId, isFromDetails = false) {
    
    if (isProcessing) return;

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};
    let button = document.querySelector(`.container[data-id="${itemId}"] .like`);
    let selectedProduct = product.find(p => p.id == itemId);

    isProcessing = true;
    button.classList.add("loading");
    button.innerHTML = `<div class="spinner"></div>`;

    setTimeout(() => {
        if (!isFromDetails) {
            showPopup(selectedProduct, () => addItemToCart());
        } else {
            addItemToCart();
        }
    }, 700);

    function addItemToCart() {
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
        }
        button.innerHTML = `<i class="bx bx-check-circle added"></i>`;
        button.classList.remove("loading");
        button.classList.add("added-to-cart");
        button.disabled = true;
        setTimeout(() => {
            checkCartStatus();
            button.classList.remove("added-to-cart");
        }, 700);
        isProcessing = false;
    }
}


function showPopup(product, onConfirm) {
    let overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    let popup = document.createElement("div");
    popup.classList.add("cart-popup");
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-text">
                <p>${product.category}</p>
                <h2 class="popup-title">${product.title}</h2>
                <p class="description">${product.description}</p>
                <div class="size">
                    <a href="size-guide.png" target="_blank"><p class="sizeguid">
                        <i class="fa fa-arrows-h" aria-hidden="true">Size Guide</i> 
                    </p></a>
                    <h2>Sizes</h2>
                    ${product.sizes.map(size => `<button class="size-btn">${size}</button>`).join("")}
                </div>
                <h2 class="select">Select : Size & Color</h2>
                <div class="colors">
                    <h2>Colors</h2>
                    ${product.colors.map(color => `<button class="color-btn">${color}</button>`).join("")}
                </div>
                <button class="confirm-btn" disabled>Confirm</button>
            </div>
            <button class="remove-btn"><i class='bx bx-x'></i></button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    document.body.classList.add("modal-open");
    document.documentElement.classList.add("modal-open");

    let selectedSize = null;
    let selectedColor = null;

    const sizeButtons = popup.querySelectorAll(".size-btn");
    const colorButtons = popup.querySelectorAll(".color-btn");
    const confirmBtn = popup.querySelector(".confirm-btn");

    // Size selection
    sizeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            sizeButtons.forEach(b => b.classList.remove("selected")); // clear all
            btn.classList.add("selected"); // mark selected
            selectedSize = btn.textContent;
            toggleConfirm();
        });
    });

    // Color selection
    colorButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            colorButtons.forEach(b => b.classList.remove("selected")); // clear all
            btn.classList.add("selected"); // mark selected
            selectedColor = btn.textContent;
            toggleConfirm();
        });
    });

   
    

    // Enable confirm only when both selected
    function toggleConfirm() {

        if (selectedSize && selectedColor) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = `Confirm <i class='bx bxs-check-circle'></i>`;
            confirmBtn.classList.add("confirm");
            
        } else {
            confirmBtn.disabled = true;
        }

    }

    // Confirm click
    confirmBtn.addEventListener("click", () => {
        closePopup(popup, overlay);
        onConfirm();
    });

    // Close popup
    popup.querySelector(".remove-btn").addEventListener("click", () => {
        closePopup(popup, overlay);
    });
}


function closePopup(popup, overlay) {
    document.body.removeChild(popup);
    document.body.removeChild(overlay);

    document.body.classList.remove("modal-open");
    document.documentElement.classList.remove("modal-open");
    stopButtonAnimation();
}

function stopButtonAnimation() {
    let button = document.querySelector(".like.loading");
    if (button) {
        button.innerHTML = '<i class="bx bxs-cart-alt"></i>';  
        button.classList.remove("loading");
        isProcessing = false; 
    }
}


function cartcount() {
    let cartcount = document.querySelector(".cart-count");
    if (cartItem.length > 0) {
        cartcount.style.visibility = "visible";
        cartcount.innerHTML = cartItem.length;
    } else {
        cartcount.style.visibility = "hidden";
    }
}

function cartcount2() {
    let cartcount2 = document.querySelector(".cart-count2");
    if (cartItem.length > 0) {
        cartcount2.style.visibility = "visible";
        cartcount2.innerHTML = cartItem.length;
    } else {
        cartcount2.style.visibility = "hidden";
    }
}

function displayData() {
    let cardContainer = document.querySelector(".cards");
    if (!cardContainer) return;
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    product.forEach((item) => {
        let isInCart = cartItems.includes(item.id.toString());
        let card = `
        <div class="container" data-id="${item.id}">
            <div class="img-container">
                <div class="img-card">
                    <div class="front pic1"></div>
                    <div class="images-and-sizes">
                        <img src="${item.image}" alt="Shoe Image" class="product-image">
                    </div>
                </div>
            </div>
            <div class="product">
                <p>${item.category}</p>
                <h1>${item.title}</h1>
                <span class="pkr">Rs </span> .
                <span class="price">${item.price}</span>
                <span class="old-price">${item.oldPrice}</span>
                <span class="discount">${item.discount}</span>
                <p class="description">${item.description}</p>
                <div class="buttons">
                    <button class="add">${item.rating}</button>
                    <button class="like ${isInCart ? 'disabled' : ''}" 
                        onclick="addToCart(${item.id})"
                        ${isInCart ? 'disabled' : ''}>
                        ${isInCart ? '<i class="bx bx-check-circle added"></i>' : '<i class="bx bxs-cart-alt"></i>'}
                    </button>
                </div>
            </div>
        </div>`;
        cardContainer.innerHTML += card;
    });
    document.querySelectorAll(".product-image").forEach(image => {
        image.addEventListener("click", function () {
            let parent = this.closest(".container");
            let productId = parent.getAttribute("data-id");
            let selectedProduct = product.find(p => p.id == productId);
            if (selectedProduct) {
                localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
                window.location.href = "details.html";
            }
        });
    });
}

/* CSS Styles for Popup */
