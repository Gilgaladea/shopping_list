// === MODEL ===
let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

function saveData() {
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

// === VIEW ===
function renderLists() {
  const toBuyList = document.getElementById("toBuyList");
  const productContainer = document.getElementById("productContainer");
  const search = document.getElementById("searchInput").value.toLowerCase();

  toBuyList.innerHTML = "";
  productContainer.innerHTML = "";

  const categories = {};

  shoppingList.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  for (let category in categories) {
    const catBlock = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = translations[currentLang].categories[category] || category;
    catBlock.appendChild(title);

    categories[category].forEach(item => {
      if (!item.name.toLowerCase().includes(search)) return;

      const li = document.createElement("li");
      li.classList.add("product-item");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.toBuy;
      checkbox.addEventListener("change", () => toggleToBuy(item.id));

      const label = document.createElement("span");
      label.className = "product-label";
      label.textContent = item.name;

      const deleteBtn = document.createElement("span");
      deleteBtn.textContent = "×";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => deleteProduct(item.id));

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(deleteBtn);
      catBlock.appendChild(li);
    });

    productContainer.appendChild(catBlock);
  }

  // To Buy list
  shoppingList.filter(i => i.toBuy).forEach(item => {
    const li = document.createElement("li");
    li.classList.add("product-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.addEventListener("change", () => toggleToBuy(item.id));

    const label = document.createElement("span");
    label.className = "product-label";
    label.textContent = item.name;

    li.appendChild(checkbox);
    li.appendChild(label);
    toBuyList.appendChild(li);
  });
}

// === CONTROLLER ===
document.getElementById("addItemForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("itemName").value;
  const category = document.getElementById("itemCategory").value;
  if (!name || !category) return;

  shoppingList.push({ id: Date.now(), name, category, toBuy: false });
  saveData();
  renderLists();
  e.target.reset();
});

function toggleToBuy(id) {
  const item = shoppingList.find(i => i.id === id);
  item.toBuy = !item.toBuy;
  saveData();
  renderLists();
}

function deleteProduct(id) {
  shoppingList = shoppingList.filter(i => i.id !== id);
  saveData();
  renderLists();
}

document.getElementById("searchInput").addEventListener("input", renderLists);

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
document.getElementById("themeToggle").textContent = isDark
  ? translations[currentLang].themeToggleLight
  : translations[currentLang].themeToggleDark;

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  const isDark = document.body.classList.contains("dark-mode");
  document.getElementById("themeToggle").textContent = isDark
    ? translations[currentLang].themeToggleLight
    : translations[currentLang].themeToggleDark;

  updateLanguage();
});

let currentLang = "pl";

function updateLanguage() {
  const t = translations[currentLang];

  document.querySelector(".sidebar h3").textContent = t.menu;
  document.querySelector(".sidebar h4.centered_text").textContent = t.settings;
  document.querySelectorAll(".sidebar h4.centered_text")[1].textContent = t.addProduct;
  document.querySelector("#itemName").placeholder = t.productPlaceholder;
  document.querySelector("#itemCategory").options[0].text = t.categoryPlaceholder;
  document.querySelector("#addItemForm button").textContent = t.addButton;
  document.querySelectorAll(".sidebar h4.centered_text")[2].textContent = t.switchOrder;
  document.querySelector(".main h2").textContent = t.toBuyTitle;
  document.querySelector(".product-list h3").textContent = t.allProducts;
  document.querySelector("#searchInput").placeholder = t.search;
  const isDark = document.body.classList.contains("dark-mode");
document.querySelector("#themeToggle").textContent = isDark
  ? t.themeToggleLight
  : t.themeToggleDark;
  document.querySelector("#languageToggle").textContent = t.languageToggle;
  const select = document.getElementById("itemCategory");
for (let i = 1; i < select.options.length; i++) {
  const val = select.options[i].value;
  select.options[i].textContent = translations[currentLang].categories[val];
}

  renderLists();
}

document.getElementById("languageToggle").addEventListener("click", () => {
  currentLang = currentLang === "pl" ? "en" : "pl";
  updateLanguage();
});

// Inicjalizacja
renderLists();