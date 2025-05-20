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

  categoryOrder.forEach(category => {
  if (!categories[category]) return;

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
});

  // To Buy list
  categoryOrder.forEach(category => {
  shoppingList
    .filter(i => i.toBuy && i.category === category)
    .forEach(item => {
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

  const savedLang = localStorage.getItem("lang");
  if (savedLang === "en" || savedLang === "pl") {
    currentLang = savedLang;
  }

  const isDark = document.body.classList.contains("dark-mode");
  document.getElementById("themeToggle").textContent = isDark
    ? translations[currentLang].themeToggleLight
    : translations[currentLang].themeToggleDark;

  document.querySelector(".toggle-category-order")
  .addEventListener("click", toggleCategoryOrderVisibility);

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
  renderCategoryOrderList();
  document.getElementById("categoryOrderList").style.display = "none";
  renderLists();
}

document.getElementById("languageToggle").addEventListener("click", () => {
  currentLang = currentLang === "pl" ? "en" : "pl";
  localStorage.setItem("lang", currentLang);
  updateLanguage();
});

const defaultCategoryOrder = [
  "dairy", "bread", "fruits", "vegetables", "meat", "fish",
  "dry", "frozen", "beverages", "snacks", "other"
];

let categoryOrder = JSON.parse(localStorage.getItem("categoryOrder")) || defaultCategoryOrder;

function saveCategoryOrder() {
  localStorage.setItem("categoryOrder", JSON.stringify(categoryOrder));
}

function renderCategoryOrderList() {
  const ul = document.getElementById("categoryOrderList");
  ul.innerHTML = "";

  categoryOrder.forEach(key => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.category = key;
    li.textContent = translations[currentLang].categories[key] || key;

    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      const newOrder = [...ul.querySelectorAll("li")].map(li => li.dataset.category);
      categoryOrder = newOrder;
      saveCategoryOrder();
      renderLists(); // aktualizujemy widok
    });

    ul.appendChild(li);
  });

  ul.addEventListener("dragover", e => {
    e.preventDefault();
    const dragging = ul.querySelector(".dragging");
    const afterElement = getDragAfterElement(ul, e.clientY);
    if (afterElement == null) {
      ul.appendChild(dragging);
    } else {
      ul.insertBefore(dragging, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function toggleCategoryOrderVisibility() {
  const list = document.getElementById("categoryOrderList");
  const icon = document.getElementById("toggleIcon");

  const isHidden = list.style.display === "none";
  list.style.display = isHidden ? "block" : "none";

  if (icon) {
    icon.textContent = isHidden ? "▲" : "▼";
  }
}

// Inicjalizacja
renderLists();