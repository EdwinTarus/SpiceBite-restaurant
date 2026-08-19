fetch("/static/data/popular-dishes.json")
    .then(response => response.json())
    .then(dishes => {

        const dishesGrid = document.getElementById("popular-dishes-grid");

        dishes.forEach(dish => {

            const card = document.createElement("article");

            card.className =
                "overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg";

            card.innerHTML = `
                <!-- Image -->
                <div class="relative h-64 overflow-hidden">

                    <img
                        src="${dish.img}"
                        alt="${dish.name}"
                        class="h-full w-full object-cover transition duration-500 hover:scale-105"
                    >

                    <!-- Tag -->
                    <span class="absolute left-4 top-4 rounded-full bg-[var(--spice-orange)] px-3 py-1 font-body text-xs font-semibold text-white">
                        ${dish.tag}
                    </span>

                </div>

                <!-- Card Content -->
                <div class="flex min-h-[220px] flex-col p-5">

                    <!-- Name + Price -->
                    <div class="flex items-start justify-between gap-4">

                        <h3 class="font-display text-xl font-bold text-[var(--spice-dark)]">
                            ${dish.name}
                        </h3>

                        <span class="shrink-0 font-body text-base font-semibold text-[var(--spice-orange)]">
                            ${dish.price}
                        </span>

                    </div>

                    <!-- Description -->
                    <p class="mt-3 font-body text-sm leading-relaxed text-[var(--spice-text)]/70">
                        ${dish.desc}
                    </p>

                </div>
            `;

            dishesGrid.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error loading popular dishes:", error);
    });

const menuCategories = document.getElementById("menuCategories");
const menuItemsContainer = document.getElementById("menuItems");
const viewFullMenuBtn = document.getElementById("viewFullMenuBtn");

let allMenuItems = [];
let activeCategory = "All";
let showAllMenuItems = false;

fetch("/static/data/menu.json")
    .then(response => response.json())
    .then(menuItems => {

        allMenuItems = menuItems;

        createCategories(menuItems);
        displayMenuItems(menuItems);

    })
    .catch(error => {
        console.error("Error loading menu:", error);
    });

function createCategories(menuItems) {

    const categories = [
        "All",
        ...new Set(menuItems.map(item => item.category))
    ];

    categories.forEach(category => {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent = category;

        updateCategoryButton(button, category);

        button.addEventListener("click", () => {

            activeCategory = category;

            updateCategoryButtons();

            if (category === "All") {
                displayMenuItems(allMenuItems);
            } else {

                const filteredItems = allMenuItems.filter(
                    item => item.category === category
                );

                displayMenuItems(filteredItems);
            }

        });

        menuCategories.appendChild(button);
    });
}

function updateCategoryButton(button, category) {

    if (category === activeCategory) {

        button.className = `
            rounded-full
            bg-[var(--spice-orange)]
            px-5 py-2.5
            font-body
            text-sm
            font-semibold
            text-white
            transition
        `;

    } else {

        button.className = `
            rounded-full
            bg-white
            px-5 py-2.5
            font-body
            text-sm
            font-medium
            text-[var(--spice-dark)]
            transition
            hover:bg-[var(--spice-orange)]
            hover:text-white
        `;
    }
}

function updateCategoryButtons() {

    const buttons = menuCategories.querySelectorAll("button");

    buttons.forEach(button => {

        updateCategoryButton(
            button,
            button.textContent
        );

    });
}

function displayMenuItems(items) {
    console.log("displayMenuItems called");
    console.log("Items received:", items);

    menuItemsContainer.innerHTML = "";

    const itemsToDisplay = showAllMenuItems
        ? items
        : items.slice(0, 8);

    itemsToDisplay.forEach(item => {

        const card = document.createElement("article");

        card.className = `
            rounded-xl
            bg-white
            p-5
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
        `;

        card.innerHTML = `
            <div class="flex items-start justify-between gap-4">

                <div>
                    <h3 class="font-display text-xl font-bold text-[var(--spice-dark)]">
                        ${item.name}
                    </h3>

                    <p class="mt-2 font-body text-sm leading-relaxed text-[var(--spice-text)]/70">
                        ${item.desc}
                    </p>
                </div>

                <span class="shrink-0 font-body text-sm font-bold text-[var(--spice-orange)]">
                    ${item.price}
                </span>

            </div>
        `;

        menuItemsContainer.appendChild(card);
    });
}

viewFullMenuBtn.addEventListener("click", () => {

    showAllMenuItems = !showAllMenuItems;

    if (activeCategory === "All") {

        displayMenuItems(allMenuItems);

    } else {

        const filteredItems = allMenuItems.filter(
            item => item.category === activeCategory
        );

        displayMenuItems(filteredItems);
    }

    updateViewButton();
});

function updateViewButton() {

    const text = viewFullMenuBtn.querySelector("span");
    const icon = viewFullMenuBtn.querySelector("svg");

    if (showAllMenuItems) {

        text.textContent = "Show Less";

        icon.innerHTML = `
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m5 15 7-7 7 7"
            />
        `;

    } else {

        text.textContent = "View Full Menu";

        icon.innerHTML = `
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m5 9 7 7 7-7"
            />
        `;
    }
}
