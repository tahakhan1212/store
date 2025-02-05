let selectedProduct = {};
onload();

function onload() {
    loadProductData();
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

        document.querySelector(".addtobag button").addEventListener("click", function () {
            addToCart(selectedProduct.id);
        });
    }
}

// **Add to Cart Function (Same as cart.js)**
function addToCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []; // Local storage se cart lo
    
    if (!cartItems.includes(itemId)) { // Agar item cart me nahi hai to add karo
        cartItems.push(itemId);
        alert("Product added to cart!");
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        location.reload()
        // **cart.js ke tarah update functions**
    } else {
        alert("Item already in cart!");
    }
}

// **Main Image Change Function**
function changeMainImage(src) {
    document.querySelector(".main_image img").src = src;
}

// **Product Details Display Function**
function displayDetails(product) {
    let detailsContainer = document.querySelector(".right");
    let details = `
        <h3>${product.title}</h3>
        <p id="category">${product.category}</p>
        <div class="prices">
            <h4><small>PKR </small> ${product.price}</h4>
            <h4><del>${product.oldPrice}</del></h4>
            <h4>${product.discount}</h4>
        </div>
        <p class="description">${product.description}</p>
        <div class="quantity-and-rating">
            <h5>Quantity</h5>
            <h5>Rating ⭐⭐⭐⭐⭐</h5>
        </div>
        <div class="quantity-container">
            <button class="quantity-btn decrease">-</button>
            <input type="number" class="quantity-input" value="1" min="1" id="abc">
            <button class="quantity-btn increase">+</button>
        </div>
        <div class="addtobag">
            <button>Add To Cart &nbsp;<i class='bx bxs-cart-alt'></i></button>
        </div>
    `;
    detailsContainer.innerHTML = details;
}
