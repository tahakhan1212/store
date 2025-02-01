displaycategory();
function displaycategory() {
    let categoryContainer = document.querySelector(".category-main-container");
    
    category.forEach((item) => {
        let categories = `
        <div class="categories-container">
        <div class="categories">
                    <div class="category">
                        <img src="${item.image}" alt="">
                    </div>
                    <p>${item.title}</p>
                </div>
            </div>`;
        categoryContainer.innerHTML += categories;
    });
}

