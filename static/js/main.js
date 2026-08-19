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