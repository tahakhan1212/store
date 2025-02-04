
document.addEventListener("DOMContentLoaded", function () {
    let productData = localStorage.getItem("selectedProduct");

    if (productData) {
        let product = JSON.parse(productData);

        
        document.querySelector(".main_image img").src = product.image;

        
        document.querySelector(".right h3").innerText = product.title;
        document.querySelector("#category").innerText = product.category;
        document.querySelector(".prices h4:nth-child(1)").innerHTML = `<small>PKR </small> ${product.price}`;
        document.querySelector(".prices h4:nth-child(2)").innerHTML = `<del>${product.oldPrice}</del>`;
        document.querySelector(".prices h4:nth-child(3)").innerText = product.discount;
        document.querySelector(".description").innerText = product.description;
            
            let button =document.querySelector(".addtobag");
            button.addEventListener("click", function () {
                alert("Product added to cart!");
                addToCart(product.id);
                
            });
        
        let images = product.pics.split(",");
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
});

function changeMainImage(src) {
    document.querySelector(".main_image img").src = src;
}


