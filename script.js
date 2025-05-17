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
    title.textContent = category;
    catBlock.appendChild(title);

    categories[category].forEach(item => {
      if (!item.name.toLowerCase().includes(search)) return;

      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.toBuy;

      checkbox.addEventListener("change", () => toggleToBuy(item.id));

      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(" " + item.name));
      catBlock.appendChild(li);
    });

    productContainer.appendChild(catBlock);
  }

  // To Buy
  shoppingList.filter(i => i.toBuy).forEach(item => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.addEventListener("change", () => toggleToBuy(item.id));

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + item.name));
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
  item = shoppingList.filter(i => i.id !== id);
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  renderLists();
}

document.getElementById("searchInput").addEventListener("input", renderLists);

// Inicjalizacja
renderLists();
