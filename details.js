let selectedProduct = {};
onload();

function onload() {
    loadProductData();
    updateCartCount();
}

function loadProductData() {
    let productData = localStorage.getItem("selectedProduct");

    if (productData) {
        selectedProduct = JSON.parse(productData);

        document.querySelector(".main_image img").src = selectedProduct.image;
        displayDetails(selectedProduct);

        let images = selectedProduct.pics.split(",");
        let optionContainer = document.querySelector(".option");
        optionContainer.innerHTML = "";

        images.forEach(imgSrc => {
            let imgElement = document.createElement("img");
            imgElement.src = imgSrc;
            imgElement.onclick = function () {
                changeMainImage(imgSrc);
            };
            optionContainer.appendChild(imgElement);
        });

    }
}
document.querySelector(".addtobag button").addEventListener("click", function () {
    addToCart(selectedProduct.id, this); // ✅ Button ka reference pass ho raha hai
});

function addToCart(itemId, buttonElement) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};

    if (!cartItems.includes(itemId.toString())) {
        cartItems.push(itemId.toString());
        quantities[itemId.toString()] = 1;

        localStorage.setItem(itemId + "_quantity", JSON.stringify(1));
        localStorage.setItem(itemId + "_totalPrice", JSON.stringify(selectedProduct.price));

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.setItem("cartQuantities", JSON.stringify(quantities));
        
        updateCartCount();
        
    } else {
        buttonElement.style.backgroundColor = "red";
        buttonElement.style.color = "white";
        buttonElement.innerHTML = "Item Already in Cart <i class='bx bxs-cart-alt icon'></i>";
        
        setTimeout(() => {
            window.location.href = "addtocart.html";
        }, 1000); 
        
        return;
    }
}

function updateCartCount() {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    let cartCountElement = document.querySelector(".cart-count");
    let cartCountElement2 = document.querySelector(".cart-count2"); // ✅ Naya element select karna

    cartCountElement.textContent = cartItems.length;
    cartCountElement.style.display = cartItems.length > 0 ? "block" : "none";

    if (cartCountElement2) {
        cartCountElement2.textContent = cartItems.length; // ✅ cart-count2 bhi update hoga
        cartCountElement2.style.display = cartItems.length > 0 ? "block" : "none";
    }
}


function changeMainImage(src) {
    document.querySelector(".main_image img").src = src;
}

function displayDetails(product) {
    let detailsContainer = document.querySelector(".right");
    let details = `
        <h3 id="title">${product.title}</h3>
        <p id="category">${product.category}</p>
        <div class="prices">
            <h4> <span class="pkr"> Rs </span>.${product.price}</h4>
            <h4><del>${product.oldPrice}</del></h4>
            <h4 class="discount">${product.discount}</h4>
        </div>
        <div class="discription">
        <p class="descriptions">${product.description}</p>
        </div>
        
        <div class="sizes">
        <a href="size-guide.png"><p class="sizeguide"><i class="fa fa-arrows-h" aria-hidden="true"></i>
size guide</p></a>
        <h2>Sizes &nbsp;<small>(UK)</small></h2>
    <span>3.5</span>
    <span>4</span>
    <span>4.5</span>
    <span>5</span>
    <span>5.5</span>
    <span>6</span>
    <span>6.5</span>
    <span>7</span>
</div>

    <div class="rating-container">
        <div class="quantity-and-rating">
            <h4>Product Rating</h4>
            <h5>${product.rating}</h5>
        </div>
        <div class="quantity-and-rating">
            <h5 class="bestseller">Best seller</h5>
            <h1><strong>Customer</strong> Reviews &nbsp;<i class='bx bxs-star' ></i></h1>
            <h5>${product.sold} Sold</h5>
        </div>

        <div class="reviews-container">
        <div class="reviews-box">
        <img src="shoes/pic-1.webp" alt="">
        <div class="review-description">
        <h3>Selena Gomez </h3>
        <p>Unmatched quality, absolutely worth the investment!</p>
        </div>
        <p class="rating">4.4⭐</p>
    </div>

        <div class="reviews-box">
        <img src="shoes/pic-2.webp" alt="">
        <div class="review-description">
        <h3>Leonardo Dicaprio</h3>
        <p>Exceeded expectations, would buy again anytime!</p>
        </div>
        <p class="rating">4.8⭐</p>
    </div>

        <div class="reviews-box">
        <img src="shoes/pic-3.webp" alt="">
        <div class="review-description">
        <h3>Alexandra Daddario</h3>
        <p>Best product, truly exceeded my expectations!</p>
        </div>
        <p class="rating">5⭐</p>
    </div>

        <div class="reviews-box">
        <img src="shoes/pic-4.webp" alt="">
        <div class="review-description">
        <h3>Katy Perry</h3>
        <p>Exceptional craftsmanship, perfect for everyday use!</p>
        </div>
        <p class="rating">4.8⭐</p>
    </div>

        <div class="reviews-box">
        <img src="shoes/pic-6.webp" alt="">
        <div class="review-description">
        <h3>Tony Stark</h3>
        <p>Top-quality design, totally worth the price!</p>
        </div>
        <p class="rating">4.2⭐</p>
    </div>

        <div class="reviews-box">
        <img src="shoes/pic-5.webp" alt="">
        <div class="review-description">
        <h3>Jin Woo</h3>
        <p>Amazing performance, couldn’t ask for more!</p>
        </div>
        <p class="rating">4.9⭐</p>
    </div>

</div>

  </div>
        
        <div class="addtobag">
            <button class="details-addtocart" onclick="details-addToCart()">-${product.discount} Now! &nbsp; Add To Cart! &nbsp;<i class='bx bxs-cart-alt'></i></button>
        </div>
    `;
    detailsContainer.innerHTML = details;
}
