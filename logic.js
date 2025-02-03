let cartItem;
onload();
function onload() {
    let cartItemsStr = localStorage.getItem("cartItems");
    cartItem = cartItemsStr ? JSON.parse(cartItemsStr) : []   
    displayData();
    cartcount();
    cartcount2();
}

function addToCart(itemid) {
    cartItem.push(itemid);
    localStorage.setItem("cartItems", JSON.stringify(cartItem));
    cartcount();
    cartcount2();
    showCartItems();
    location.reload()
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
        let card = `<div class="container"
                    data-images="${item.pics}">
                  
                    <div class="img-container">
                        <div class="img-card">
                            <div class="front pic1"></div>
                            <div class="images-and-sizes">
                               <a href="details.html"><img src="${item.image}" alt="Shoe Image"></a>
                            </div>
                        </div>
                    </div>
                    <div class="slideshow-buttons">
                        <span class="focus"></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="product">
                        <p>${item.category}</p>
                        <h1>${item.title}</h1>
                        <span class="pkr">PKR </span>
                        <span class="price">${item.price}</span>
                        <span class="old-price">${item.oldPrice}</span>
                        <span class="discount">${item.discount}</span>
                        <p class="description">${item.description}</p>
                        <div class="buttons">
                            <button class="add">⭐⭐⭐⭐⭐</button>
                          <button class="like" onclick="addToCart(${item.id})"><i class='bx bxs-cart-alt'></i>
                            </button>
                        </div>
                    </div>
                </div>`;
        cardContainer.innerHTML += card;
    });
}