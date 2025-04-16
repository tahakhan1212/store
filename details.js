let selectedProduct = {};
let selectedSize = null;
let selectedColor = null;

document.addEventListener("DOMContentLoaded", () => {
    loadProduct();
    setupColorImageLinking();
    updateCartCount();
    checkCartStatus();
    handleOtherImageHover();
    setupMainAddToCart();
    setupCardCartButtons();
});

function loadProduct() {
    const productData = localStorage.getItem("selectedProduct");
    if (!productData) return;

    selectedProduct = JSON.parse(productData);

    // Get previously selected size/color
    selectedSize = localStorage.getItem(selectedProduct.id + "_size") || null;
    selectedColor = localStorage.getItem(selectedProduct.id + "_color") || null;

    document.querySelector(".main_image img").src = selectedProduct.image;

    showProductDetails(selectedProduct);

    const options = selectedProduct.pics.split(",");
    const optionBox = document.querySelector(".option");
    optionBox.innerHTML = "";

    options.forEach((pic, index) => {
        const img = document.createElement("img");
        img.src = pic;
        img.dataset.index = index;
        img.classList.add("option-img");
        img.onclick = () => {
            changeMain(pic);
            highlightColorByIndex(index);
            highlightImageByIndex(index);
        };
        optionBox.appendChild(img);
    });

    const extraPics = selectedProduct.extraPics?.split(",") || [];
    const otherBox = document.querySelector(".other-images");
    otherBox.innerHTML = "";

    extraPics.forEach(pic => {
        const img = document.createElement("img");
        img.src = pic;
        otherBox.appendChild(img);
    });
}

function setupColorImageLinking() {
    const colorButtons = document.querySelectorAll(".color-btn");
    const optionImages = document.querySelectorAll(".option-img");

    colorButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const imgSrc = selectedProduct.pics.split(",")[index];
            changeMain(imgSrc);
            highlightImageByIndex(index);
            highlightColorByIndex(index);
        });
    });
}

function highlightColorByIndex(index) {
    const colorBtns = document.querySelectorAll(".color-btn");
    colorBtns.forEach((btn, i) => {
        btn.classList.toggle("active-color", i === index);
    });
}

function highlightImageByIndex(index) {
    document.querySelectorAll(".option-img").forEach((img, i) => {
        img.classList.toggle("selected", i === index);
    });
}

function changeMain(src) {
    document.querySelector(".main_image img").src = src;
}

function handleOtherImageHover() {
    const otherBox = document.querySelector(".other-images");

    otherBox.addEventListener("mouseenter", (e) => {
        if (e.target.tagName === "IMG") {
            changeMain(e.target.src);
            e.target.style.border = "2px solid var(--primary-color)";
            e.target.style.borderRadius = "13px"; 
            e.target.style.transition = "all 0.1s ease-in-out";
        }
    }, true);
    
    otherBox.addEventListener("mouseleave", (e) => {
        if (e.target.tagName === "IMG") {
            e.target.style.border = "none"; 
            e.target.style.borderRadius = ""; 
        }
    }, true);
}


function setupMainAddToCart() {
    const btn = document.querySelector(".details-addtocart");
    if (!btn) return;

    btn.disabled = true;
    btn.classList.add("disabled");

    btn.addEventListener("click", function () {
        if (!selectedSize || !selectedColor) return;

        // Save selected size and color
        localStorage.setItem(selectedProduct.id + "_size", selectedSize);
        localStorage.setItem(selectedProduct.id + "_color", selectedColor);

        addToCart(selectedProduct.id, true);
        animateAddButton(this);
    });
}

function setupCardCartButtons() {
    document.querySelectorAll(".card .add-to-cart-icon").forEach(btn => {
        btn.addEventListener("click", function () {
            addToCart(this.dataset.id);
            showPopup("Product added to cart!");
        });
    });
}

function addToCart(id) {
    const itemId = id.toString();
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    let qty = JSON.parse(localStorage.getItem("cartQuantities")) || {};

    if (!cart.includes(itemId)) {
        cart.push(itemId);
        qty[itemId] = 1;

        localStorage.setItem(itemId + "_quantity", "1");
        localStorage.setItem(itemId + "_totalPrice", selectedProduct.price.toString());
        localStorage.setItem(itemId + "_size", selectedSize);
        localStorage.setItem(itemId + "_color", selectedColor);

        localStorage.setItem("cartItems", JSON.stringify(cart));
        localStorage.setItem("cartQuantities", JSON.stringify(qty));
    }

    updateCartCount();
}

function animateAddButton(btn) {
    btn.classList.add("loading");
    btn.innerHTML = "Adding... <span class='loader'></span>";
}

function styleBtn(btn) {
    btn.style.background = "var(--extra-color)";
    btn.style.color = "var(--text-color)";
    btn.style.transition = "0.3s ease";
}

function checkCartStatus() {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const btn = document.querySelector(".details-addtocart");
    if (!btn) return;

    if (cart.includes(selectedProduct.id.toString())) {
        btn.innerHTML = "Check Your Cart &nbsp;<i class='bx bxs-cart-alt'></i>";
        styleBtn(btn);
        btn.onclick = () => window.location.href = "addtocart.html";
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const count = cart.length;

    document.querySelectorAll(".cart-count, .cart-count2").forEach(el => {
        el.textContent = count;
        el.style.visibility = count > 0 ? "visible" : "hidden";
    });
}

function showPopup(msg) {
    const popup = document.querySelector(".popup");
    if (popup) {
        popup.querySelector(".popup-message").innerText = msg;
        popup.classList.add("visible");
        setTimeout(() => popup.classList.remove("visible"), 2000);
    }
}

function checkIfReadyToAdd() {
    const btn = document.querySelector(".details-addtocart");
    if (!btn) return;

    if (selectedSize && selectedColor) {
        btn.disabled = false;
        btn.innerHTML = `<h3>confirm <i class='bx bxs-check-circle'></i></h3>`;
        btn.classList.remove("disabled");
    } else {
        btn.disabled = true;
        btn.classList.add("disabled");
    }
}

function showProductDetails(product) {
    const right = document.querySelector(".right");
    if (!right) return;

    const sizeBtns = product.sizes.map(size => `<button class="${selectedSize === size ? 'active-size' : ''}">${size}</button>`).join("");
    const colorBtns = product.colors.map((color, index) => `
        <button class="color-btn ${selectedColor === color ? 'active-color' : ''}" data-index="${index}">${color}</button>
    `).join("");

    right.innerHTML = `
        <h3 id="title">${product.title}</h3>
        <p id="category">${product.category}</p>
        <div class="prices">
            <h4><span class="pkr">Rs</span>. ${product.price} </h4>
            <h4><del>${product.oldPrice}</del></h4>
            <h4 class="discount">${product.discount}</h4>
        </div>
        <div class="discription">
            <p class="descriptions">${product.description}</p>
        </div>
        <a href="size-guide.png">
            <p class="sizeguide"><i class="fa fa-arrows-h" aria-hidden="true"></i> size guide</p>
        </a>
        <div class="sizes">
            <h2>Sizes:</h2>
            ${sizeBtns}
        </div>
        <div class="colors">
            <h2>Colors:</h2>
            ${colorBtns}
        </div>
        <div class="rating-container">
            <div class="quantity-and-rating">
                <h4>Product Rating</h4>
                <h5>${product.rating}</h5>
            </div>
            <div class="quantity-and-rating">
                <h5 class="bestseller">Best seller</h5>
                <h1><strong>Customer</strong> Reviews &nbsp;<i class='bx bxs-star'></i></h1>
                <h5>${product.sold} <span class="pluscolor">+</span> Sold</h5>
            </div>
            <div class="reviews-container">
                ${createReviews()}
            </div>
        </div>
        <div class="addtobag">
            <button class="details-addtocart disabled">-${product.discount} Now! &nbsp; Add To Cart! &nbsp;<i class='bx bxs-cart-alt'></i></button>
        </div>
    `;

    // Set selected size
    document.querySelectorAll(".sizes button").forEach(btn => {
        btn.addEventListener("click", () => {
            selectedSize = btn.textContent;
            document.querySelectorAll(".sizes button").forEach(b => b.classList.remove("active-size"));
            btn.classList.add("active-size");
            checkIfReadyToAdd();
        });
    });

    // Set selected color
    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            selectedColor = btn.textContent;
            document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("active-color"));
            btn.classList.add("active-color");
            checkIfReadyToAdd();
        });
    });

    checkIfReadyToAdd();
}

function createReviews() {
    const reviews = [
        { name: "Selena Gomez", text: "Unmatched quality, absolutely worth the investment!", rating: "4.4⭐", img: "shoes/pic-1.webp" },
        { name: "Leonardo Dicaprio", text: "Exceeded expectations, would buy again anytime!", rating: "4.8⭐", img: "shoes/pic-2.webp" },
        { name: "Alexandra Daddario", text: "Best product, truly exceeded my expectations!", rating: "5⭐", img: "shoes/pic-3.webp" },
        { name: "Katy Perry", text: "Exceptional craftsmanship, perfect for everyday use!", rating: "4.8⭐", img: "shoes/pic-4.webp" },
        { name: "Tony Stark", text: "Top-quality design, totally worth the price!", rating: "4.2⭐", img: "shoes/pic-6.webp" },
        { name: "Jin Woo", text: "Amazing performance, couldn’t ask for more!", rating: "4.9⭐", img: "shoes/pic-5.webp" },
        { name: "John Wick", text: "Absolutely love the design and the comfort it offers!", rating: "5.0⭐", img: "shoes/pic-7.webp" },
        { name: "Tanjiro", text: "Perfect quality, looks even better than the pictures!", rating: "5.0⭐", img: "shoes/pic-8.webp" },
        { name: "Sataru Gojo", text: "Fast delivery and the product fits just perfectly!", rating: "5.0⭐", img: "shoes/pic-9.webp" },
        { name: "Sharukh Khan", text: "Very stylish and durable, totally worth the price!", rating: "5.0⭐", img: "shoes/pic-10.webp" },
        { name: "John Cena", text: "Color is vibrant and quality feels premium to touch!", rating: "5.0⭐", img: "shoes/pic-11.webp"},
        { name: "Jason Mamoa", text: "Received so many compliments after wearing this product!", rating: "5.0⭐", img: "shoes/pic-12.webp"},
        { name: "Elizabeth Olsen", text: "Size was accurate, and the material is super comfy!", rating: "5.0⭐", img: "shoes/pic-13.webp" },
        { name: "Ana de Armas", text: "Highly satisfied, will definitely order again soon!", rating: "5.0⭐", img: "shoes/pic-14.webp" },
        { name: "Imran Khan", text: "Product exceeded my expectations in every single way!", rating: "5.0⭐", img: "shoes/pic-15.webp"},
        { name: "sadie Sink", text: "Looks premium, feels amazing — highly recommend it!", rating: "5.0⭐", img: "shoes/pic-16.webp"}
    ];

    return reviews.map(r => `
        <div class="reviews-box">
            <img src="${r.img}" alt="${r.name} loading="lazy">
            <div class="review-description">
                <h3>${r.name}</h3>
                <p>${r.text}</p>
            </div>
            <p class="rating">${r.rating}</p>
        </div>
    `).join("");
}
