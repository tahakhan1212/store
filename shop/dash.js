const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

const sidebarState = localStorage.getItem("sidebarState");
if (sidebarState === "close") {
    sidebar.classList.add("close");
}

const modeState = localStorage.getItem("modeState");
if (modeState === "dark") {
    body.classList.add("dark");
    modeText.innerText = "Light Mode";
} else {
    modeText.innerText = "Dark Mode";
}

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    const currentState = sidebar.classList.contains("close") ? "close" : "open";
    localStorage.setItem("sidebarState", currentState);
});

searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
    localStorage.setItem("sidebarState", "open");
});

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        modeText.innerText = "Light Mode";
        localStorage.setItem("modeState", "dark");
    } else {
        modeText.innerText = "Dark Mode";
        localStorage.setItem("modeState", "light");
    }
});

document.querySelectorAll('.bx-search').forEach((searchIcon) => {
    searchIcon.addEventListener('click', function () {
        const input = this.nextElementSibling.value.toLowerCase(); // Get the input value
        const cards = document.querySelectorAll('.container'); // Select all cards

        cards.forEach((card) => {
            const cardText = card.textContent.toLowerCase(); // Card's text content
            if (cardText.includes(input)) {
                card.style.display = 'block'; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    });
});


var counter = 1;
setInterval(function(){
  document.getElementById('radio' + counter).checked = true;
  counter++;
  if(counter > 4){
    counter = 1;
  }
}, 5000);

// Select all cards
const cards = document.querySelectorAll('.container');

cards.forEach(card => {
    // Get images array from data-images attribute
    const images = card.dataset.images.split(',');

    // Select buttons and image for the current card
    const buttons = card.querySelectorAll('.slideshow-buttons span');
    const image = card.querySelector('.images-and-sizes img');

    // Add click event listeners to each button
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Update the image source for this card
            image.src = images[index];

            // Update the focus class for active button
            buttons.forEach(btn => btn.classList.remove('focus'));
            button.classList.add('focus');
        });
    });
});


