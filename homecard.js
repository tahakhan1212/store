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

function addToCart(itemId) {
    if (isProcessing) return;

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};
    let button = document.querySelector(`.container[data-id="${itemId}"] .like`);
    let selectedProduct = product.find(p => p.id == itemId);

    isProcessing = true;
    button.classList.add("loading");
    button.innerHTML = `<div class="spinner"></div>`;

    setTimeout(() => {
        showPopup(selectedProduct, () => {
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
        });
    }, 700);
}

function showPopup(product, onConfirm) {
    // 🔹 Overlay create karo
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
                    <button>3.5</button>
                    <button>4</button>
                    <button>4.5</button>
                    <button>5</button>
                    <button>5.5</button>
                    <button>6</button>
                    <button>6.5</button>
                    <button>7</button>
                </div>
                <h2 class="select">Select : Size & Color</h2>
                <div class="colors">
                <h2>Colors</h2>
                    <button>Red</button>
                    <button>Green</button>
                    <button>Blue</button>
                    <button>Orange</button>
                </div>
                <button class="confirm-btn">Confirm</button>
            </div>
            <button class="remove-btn"><i class='bx bx-x'></i></button>
        </div>
    `;

    // 🔹 Overlay aur popup ko body me add karo
    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // 🔹 Body aur HTML ko disable karo (scroll lock)
    document.body.classList.add("modal-open");
    document.documentElement.classList.add("modal-open");

    // ✅ Confirm button click event
    document.querySelector(".confirm-btn").addEventListener("click", () => {
        closePopup(popup, overlay);
        onConfirm();
    });

    // ✅ Remove button click event
    document.querySelector(".remove-btn").addEventListener("click", () => {
        closePopup(popup, overlay);
    });
}

function closePopup(popup, overlay) {
    // 🔹 Popup aur overlay remove karo
    document.body.removeChild(popup);
    document.body.removeChild(overlay);

    // 🔹 Body aur HTML ko wapas enable karo (scroll unlock)
    document.body.classList.remove("modal-open");
    document.documentElement.classList.remove("modal-open");
    stopButtonAnimation();
}

// 🔹 New function to stop button animation
function stopButtonAnimation() {
    let button = document.querySelector(".like.loading");
    if (button) {
        button.innerHTML = '<i class="bx bxs-cart-alt"></i>';  // Normal icon wapas la do
        button.classList.remove("loading");
        isProcessing = false;  // Process ko reset karo
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
