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
        const input = this.nextElementSibling.value.toLowerCase();  
        const cards = document.querySelectorAll('.container'); 

        cards.forEach((card) => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(input)) {
                card.style.display = 'block'; 
            } else {
                card.style.display = 'none'; 
            }
        });
    });
});
