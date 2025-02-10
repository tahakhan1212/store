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

function addToCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []; 
    
    let isAlreadyInCart = cartItems.some(id => id.toString() === itemId.toString());
    let detailsAddToCart = document.querySelector(".details-addtocart");

    if (!isAlreadyInCart) { 
        cartItems.push(itemId.toString());
        alert("Product added to cart!"); 
        location.reload();
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
        localStorage.setItem("itemAlreadyInCart", "true");
        detailsAddToCart.innerHTML = "Going In Cart &nbsp; <i class='bx bxs-cart-alt'></i>";  
        detailsAddToCart.style.background = "red";
        alert("Item already in cart!");
        setTimeout(() => {
            window.location.href = "cart.html";
        },1500);
    }
}
    
function changeMainImage(src) {
    document.querySelector(".main_image img").src = src;
}

function displayDetails(product) {
    let detailsContainer = document.querySelector(".right");
    let details = `
        <h3>${product.title}</h3>
        <p id="category">${product.category}</p>
        <div class="prices">
            <h4> <span class="pkr"> Rs </span>.${product.price}</h4>
            <h4><del>${product.oldPrice}</del></h4>
            <h4 class="discount">${product.discount}</h4>
        </div>
        <div class="discription">
        <p class="description">${product.description}</p>
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
        <div class="quantity-and-rating">
            <h5>Quantity</h5>
            <h5>Rating ${product.rating}</h5>
        </div>
        <div class="quantity-container">
            <button class="quantity-btn decrease">-</button>
            <input type="number" class="quantity-input" value="1" min="1" id="abc">
            <button class="quantity-btn increase">+</button>
        </div>
        <div class="addtobag">
            <button class="details-addtocart">Add To Cart &nbsp;<i class='bx bxs-cart-alt'></i></button>
        </div>
    `;
    detailsContainer.innerHTML = details;
}
