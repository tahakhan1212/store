let selectedProduct = {};

document.addEventListener("DOMContentLoaded", () => {
    loadProduct();
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

    // Main image
    document.querySelector(".main_image img").src = selectedProduct.image;

    // Details display
    showProductDetails(selectedProduct);

    // Option images
    const options = selectedProduct.pics.split(",");
    const optionBox = document.querySelector(".option");
    optionBox.innerHTML = "";
    options.forEach(pic => {
        const img = document.createElement("img");
        img.src = pic;
        img.onclick = () => changeMain(pic);
        optionBox.appendChild(img);
    });

    // Extra images
    const extraPics = selectedProduct.extraPics?.split(",") || [];
    const otherBox = document.querySelector(".other-images");
    otherBox.innerHTML = "";
    extraPics.forEach(pic => {
        const img = document.createElement("img");
        img.src = pic;
        otherBox.appendChild(img);
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
        }
    }, true);
}

function setupMainAddToCart() {
    const btn = document.querySelector(".details-addtocart");
    if (!btn) return;

    btn.addEventListener("click", function () {
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
        localStorage.setItem("cartItems", JSON.stringify(cart));
        localStorage.setItem("cartQuantities", JSON.stringify(qty));
    }

    updateCartCount();
}

function animateAddButton(btn) {
    btn.classList.add("loading");
    btn.innerHTML = "Adding... <span class='loader'></span>";

    setTimeout(() => {
        btn.classList.remove("loading");
        btn.classList.add("added");
        btn.innerHTML = "Check Your Cart &nbsp;<i class='bx bxs-cart-alt'></i>";
        styleBtn(btn);
    }, 1000);

    setTimeout(() => {
        btn.classList.remove("added");
        btn.onclick = () => window.location.href = "addtocart.html";
    }, 1700);
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

function showProductDetails(product) {
    const right = document.querySelector(".right");
    if (!right) return;

    const sizeBtns = product.sizes.map(size => `<button>${size}</button>`).join("");

    right.innerHTML = `
        <h3 id="title">${product.title}</h3>
        <p id="category">${product.category}</p>
        <div class="prices">
            <h4><span class="pkr">Rs</span>.${product.price}</h4>
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
        <div class="rating-container">
            <div class="quantity-and-rating">
                <h4>Product Rating</h4>
                <h5>${product.rating}</h5>
            </div>
            <div class="quantity-and-rating">
                <h5 class="bestseller">Best seller</h5>
                <h1><strong>Customer</strong> Reviews &nbsp;<i class='bx bxs-star'></i></h1>
                <h5>${product.sold} Sold</h5>
            </div>
            <div class="reviews-container">
                ${createReviews()}
            </div>
        </div>
        <div class="addtobag">
            <button class="details-addtocart">-${product.discount} Now! &nbsp; Add To Cart! &nbsp;<i class='bx bxs-cart-alt'></i></button>
        </div>
    `;
}

function createReviews() {
    const reviews = [
        { name: "Selena Gomez", text: "Unmatched quality, absolutely worth the investment!", rating: "4.4⭐", img: "shoes/pic-1.webp" },
        { name: "Leonardo Dicaprio", text: "Exceeded expectations, would buy again anytime!", rating: "4.8⭐", img: "shoes/pic-2.webp" },
        { name: "Alexandra Daddario", text: "Best product, truly exceeded my expectations!", rating: "5⭐", img: "shoes/pic-3.webp" },
        { name: "Katy Perry", text: "Exceptional craftsmanship, perfect for everyday use!", rating: "4.8⭐", img: "shoes/pic-4.webp" },
        { name: "Tony Stark", text: "Top-quality design, totally worth the price!", rating: "4.2⭐", img: "shoes/pic-6.webp" },
        { name: "Jin Woo", text: "Amazing performance, couldn’t ask for more!", rating: "4.9⭐", img: "shoes/pic-5.webp" }
    ];

    return reviews.map(r => `
        <div class="reviews-box">
            <img src="${r.img}" alt="${r.name}">
            <div class="review-description">
                <h3>${r.name}</h3>
                <p>${r.text}</p>
            </div>
            <p class="rating">${r.rating}</p>
        </div>
    `).join("");
}
