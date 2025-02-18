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

    // Set the processing flag to true, as animation is starting
    isProcessing = true;

    // Animation Start - Change Button Style
    button.classList.add("loading");
    button.innerHTML = `<div class="spinner"></div>`;

    setTimeout(() => {
        // Agar item already cart mein hai toh skip karein
        if (!cartItems.includes(itemId.toString())) {
            // Agar item cart mein nahi hai
            cartItems.push(itemId.toString());
            quantities[itemId.toString()] = (quantities[itemId.toString()] || 0) + 1;

            // Save updated cart and quantities to localStorage
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            localStorage.setItem("cartQuantities", JSON.stringify(quantities));

            // Store individual item data
            localStorage.setItem(itemId + "_quantity", JSON.stringify(quantities[itemId.toString()]));
            localStorage.setItem(itemId + "_totalPrice", JSON.stringify(product.find(p => p.id == itemId).price));

            // Call functions to update cart UI
            cartItem = cartItems;
            cartcount();
            cartcount2();
            isProcessing = false;  // Reset the processing flag
        }
        
        // Animation End - Show Success Checkmark
        button.innerHTML = `<i class="bx bx-check-circle added"></i>`;
        button.classList.remove("loading");
        button.classList.add("added-to-cart");
        button.disabled = true;
        // After 1.5s, revert back to cart icon and set processing flag to false
        setTimeout(() => {
            // button.innerHTML = `<i class='bx bxs-cart-alt'></i>`;
            checkCartStatus()
            button.classList.remove("added-to-cart");
        }, 700);  // 1.5s of animation duration
    }, 700); // Simulate loading for 1.5s
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

    if (!cardContainer) {
        return;
    }

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
