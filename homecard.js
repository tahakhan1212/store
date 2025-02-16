let cartItem;
onload();   
function onload() {
    let cartItemsStr = localStorage.getItem("cartItems");
    cartItem = cartItemsStr ? JSON.parse(cartItemsStr) : []   
    displayData();
    cartcount();
    cartcount2();
}

function addToCart(itemId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let quantities = JSON.parse(localStorage.getItem("cartQuantities")) || {};
    
    if (!cartItems.includes(itemId.toString())) {
        cartItems.push(itemId.toString());
        quantities[itemId.toString()] = 1; 
        localStorage.setItem(itemId + "_quantity", JSON.stringify(1));
        localStorage.setItem(itemId + "_totalPrice", JSON.stringify(product.find(p => p.id == itemId).price));
        
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.setItem("cartQuantities", JSON.stringify(quantities));

        cartItem = cartItems; 
        cartcount();  
        cartcount2();
        
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

    if (!cardContainer) {
        return;
    }

    product.forEach((item) => {
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
                <span class="pkr">Rs </span>.
                <span class="price">${item.price}</span>
                <span class="old-price">${item.oldPrice}</span>
                <span class="discount">${item.discount}</span>
                <p class="description">${item.description}</p>
                <div class="buttons">
                    <button class="add">${item.rating}</button>
                    <button class="like" onclick="addToCart(${item.id})"><i class='bx bxs-cart-alt'></i></button>
                </div>
            </div>
        </div>`;

        cardContainer.innerHTML += card;
    });

    document.querySelectorAll(".product-image").forEach(image => {
        image.addEventListener("click", function () {
            let parent = this.closest(".container");
            let productId = parent.getAttribute("data-id");

            let selectedProduct = product.find(p => p.id === productId);

            if (selectedProduct) {
                localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
                window.location.href = "details.html";
            }
        });
    });
}
