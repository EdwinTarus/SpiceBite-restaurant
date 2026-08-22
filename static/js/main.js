fetch("/static/data/popular-dishes.json")
  .then((response) => response.json())
  .then((dishes) => {
    const dishesGrid = document.getElementById("popular-dishes-grid");

    dishes.forEach((dish) => {
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
  .catch((error) => {
    console.error("Error loading popular dishes:", error);
  });

const menuCategories = document.getElementById("menuCategories");
const menuItemsContainer = document.getElementById("menuItems");
const viewFullMenuBtn = document.getElementById("viewFullMenuBtn");

let allMenuItems = [];
let activeCategory = "All";
let showAllMenuItems = false;

fetch("/static/data/menu.json")
  .then((response) => response.json())
  .then((menuItems) => {
    allMenuItems = menuItems;

    createCategories(menuItems);
    displayMenuItems(menuItems);
  })
  .catch((error) => {
    console.error("Error loading menu:", error);
  });

function createCategories(menuItems) {
  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  categories.forEach((category) => {
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
          (item) => item.category === category,
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

  buttons.forEach((button) => {
    updateCategoryButton(button, button.textContent);
  });
}

function displayMenuItems(items) {
  console.log("displayMenuItems called");
  console.log("Items received:", items);

  menuItemsContainer.innerHTML = "";

  const itemsToDisplay = showAllMenuItems ? items : items.slice(0, 8);

  itemsToDisplay.forEach((item) => {
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
      (item) => item.category === activeCategory,
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

const restaurantMap = L.map("restaurant-map").setView([-1.2641, 36.8028], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(restaurantMap);

const restaurantIcon = L.divIcon({
  className: "spicebite-marker",
  html: `
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--spice-orange)] text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="h-5 w-5">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7 3v7m0-7v7m0-7v7m0 0v11M7 10c-1.1 0-2-.9-2-2V3m4 7c1.1 0 2-.9 2-2V3M17 3v18m0-18c-1.657 1.343-2.5 3.09-2.5 5.5S15.343 13 17 13"
                />
            </svg>
        </div>
    `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const restaurantMarker = L.marker([-1.2641, 36.8028], {
  icon: restaurantIcon,
}).addTo(restaurantMap);

setTimeout(() => {
  restaurantMap.invalidateSize();
}, 200);

restaurantMarker.bindPopup(`
    <div class="min-w-[220px]">
        
        <h3 class="font-display text-lg font-bold text-[var(--spice-dark)]">
            SpiceBite Restaurant
        </h3>

        <div class="mt-2 border-t border-[var(--spice-border)] pt-2">
            
            <div class="flex items-center gap-2">

                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.8"
                    stroke="currentColor"
                    class="h-4 w-4 text-[var(--spice-orange)]">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 21s7-5.25 7-11a7 7 0 1 0-14 0c0 5.75 7 11 7 11Z"
                    />
                    <circle cx="12" cy="10" r="2.25" />
                </svg>

                <p class="font-body text-xs font-semibold uppercase tracking-wide text-[var(--spice-muted)]">
                    Find us at
                </p>

            </div>

            <p class="mt-1 font-body text-sm leading-relaxed text-[var(--spice-text)]">
                Westlands, Nairobi, Kenya
            </p>

        </div>

        <a
            href="https://www.google.com/maps/dir/?api=1&destination=-1.2641,36.8028"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[var(--spice-orange)] !text-white px-4 py-2.5 font-body text-sm font-semibold transition hover:opacity-90"
        >
            Get Directions
        </a>

    </div>
`);

const footerYear = document.getElementById("footer-year");

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}