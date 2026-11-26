// Food trail data
const foodTrails = {
  breakfast: [
    {
      id: "b1",
      vendor: "Sharma Kachori Wale",
      since: "Since 1948",
      dish: "Bedmi Puri with Spicy Aloo Sabzi",
      price: 60,
      diet: "veg",
      spice: "Spicy",
      bestTime: "7:30 AM – 10:30 AM"
    },
    {
      id: "b2",
      vendor: "Haji Karim Nihari Corner",
      since: "Since 1962",
      dish: "Mutton Nihari & Khamiri Roti",
      price: 220,
      diet: "nonveg",
      spice: "Medium-Spicy",
      bestTime: "7:00 AM – 10:00 AM"
    },
    {
      id: "b3",
      vendor: "Ram Lal Lassi & Jalebi",
      since: "Since 1955",
      dish: "Kulhad Malai Lassi with Crispy Jalebi",
      price: 85,
      diet: "veg",
      spice: "Mild (Sweet)",
      bestTime: "8:30 AM – 11:30 AM"
    }
  ],
  chaat: [
    {
      id: "c1",
      vendor: "Gupta Chaat Bhandar",
      since: "Since 1974",
      dish: "Aloo Tikki Chaat & Golgappe",
      price: 70,
      diet: "veg",
      spice: "Spicy",
      bestTime: "5:00 PM – 8:30 PM"
    },
    {
      id: "c2",
      vendor: "Nawab Seekh Kebab Stall",
      since: "Since 1981",
      dish: "Chicken Seekh Kebab with Mint Chutney",
      price: 160,
      diet: "nonveg",
      spice: "Medium",
      bestTime: "6:00 PM – 9:30 PM"
    },
    {
      id: "c3",
      vendor: "Kashi Dahi Bhalla Corner",
      since: "Since 1969",
      dish: "Stuffed Dahi Bhalla Papdi",
      price: 80,
      diet: "veg",
      spice: "Mild",
      bestTime: "4:30 PM – 8:00 PM"
    }
  ],
  sweets: [
    {
      id: "s1",
      vendor: "Brijwasi Misthan Bhandar",
      since: "Since 1939",
      dish: "Kesar Rabri & Hot Gulab Jamun",
      price: 110,
      diet: "veg",
      spice: "Mild (Sweet)",
      bestTime: "7:00 PM – 10:00 PM"
    },
    {
      id: "s2",
      vendor: "Shahi Phirni & Malpua House",
      since: "Since 1958",
      dish: "Badam Phirni in Clay Bowl",
      price: 95,
      diet: "veg",
      spice: "Mild (Sweet)",
      bestTime: "6:30 PM – 9:30 PM"
    },
    {
      id: "s3",
      vendor: "Old Town Kulfi Falooda",
      since: "Since 1971",
      dish: "Matka Kesar Pista Kulfi",
      price: 120,
      diet: "veg",
      spice: "Mild (Sweet)",
      bestTime: "8:00 PM – 11:00 PM"
    }
  ]
};

let currentTrail = "breakfast";
let currentDiet = "all";
let searchQuery = "";

// Load saved checklist from localStorage
let tastedList = JSON.parse(localStorage.getItem("streetFoodTasted")) || [];

const cardsContainer = document.getElementById("foodCards");
const tastedCounter = document.getElementById("tastedCounter");
const totalCostEl = document.getElementById("totalCost");
const searchInput = document.getElementById("searchInput");
const resetBtn = document.getElementById("resetBtn");

function saveChecklist() {
  localStorage.setItem("streetFoodTasted", JSON.stringify(tastedList));
}

// Calculate total bill across all tasted items
function updateStats(currentStops) {
  const tastedInTrail = currentStops.filter(function (item) {
    return tastedList.includes(item.id);
  }).length;

  tastedCounter.textContent = "Tasted: " + tastedInTrail + " / " + currentStops.length + " stops";

  let totalAmount = 0;
  Object.values(foodTrails).forEach(function (trailStops) {
    trailStops.forEach(function (stop) {
      if (tastedList.includes(stop.id)) {
        totalAmount += stop.price;
      }
    });
  });

  totalCostEl.textContent = "Total Spent: ₹" + totalAmount;
}

// Render food cards
function displayCards() {
  const stops = foodTrails[currentTrail];
  updateStats(stops);

  const filtered = stops.filter(function (item) {
    const matchesDiet = currentDiet === "all" || item.diet === currentDiet;
    const text = (item.vendor + " " + item.dish).toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase().trim());
    return matchesDiet && matchesSearch;
  });

  if (filtered.length === 0) {
    cardsContainer.innerHTML =
      '<div class="empty-msg">No food stops match your filter or search keyword.</div>';
    return;
  }

  cardsContainer.innerHTML = "";

  filtered.forEach(function (stop) {
    const isChecked = tastedList.includes(stop.id);
    const badgeClass = stop.diet === "veg" ? "veg-badge" : "nonveg-badge";
    const badgeText = stop.diet === "veg" ? "Pure Veg" : "Non-Veg Specialty";

    const card = document.createElement("div");
    card.className = isChecked ? "food-card checked" : "food-card";

    card.innerHTML = `
      <div>
        <div class="card-header">
          <h3>${stop.vendor}</h3>
          <span class="since-tag">${stop.since}</span>
        </div>
        <span class="diet-badge ${badgeClass}">${badgeText}</span>
        <div class="dish-info">
          <span>Signature Must-Try Dish:</span>
          <strong>${stop.dish}</strong>
        </div>
        <div class="meta-tags">
          <span class="meta-pill">Spice: ${stop.spice}</span>
          <span class="meta-pill">Best Time: ${stop.bestTime}</span>
        </div>
      </div>
      <div class="card-bottom">
        <span class="price-text">₹${stop.price}</span>
        <label class="check-item">
          <input type="checkbox" ${isChecked ? "checked" : ""} data-id="${stop.id}">
          <span>${isChecked ? "Tasted" : "Mark Tasted"}</span>
        </label>
      </div>
    `;

    cardsContainer.appendChild(card);
  });

  // Checkbox event listeners
  const checkboxes = cardsContainer.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function (box) {
    box.addEventListener("change", function () {
      const id = box.getAttribute("data-id");
      if (box.checked) {
        if (!tastedList.includes(id)) tastedList.push(id);
      } else {
        tastedList = tastedList.filter(function (item) {
          return item !== id;
        });
      }
      saveChecklist();
      displayCards();
    });
  });
}

// Trail button switching
const trailButtons = document.querySelectorAll(".tab-btn");
trailButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    trailButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    currentTrail = btn.getAttribute("data-trail");
    displayCards();
  });
});

// Diet filter switching
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    currentDiet = btn.getAttribute("data-diet");
    displayCards();
  });
});

// Live search input
searchInput.addEventListener("input", function () {
  searchQuery = searchInput.value;
  displayCards();
});

// Reset checklist
resetBtn.addEventListener("click", function () {
  tastedList = [];
  saveChecklist();
  displayCards();
});

// Initial load
displayCards();