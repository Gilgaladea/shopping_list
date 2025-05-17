// === Firebase konfiguracja ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFORia989pRh6Q7n0PRPv2JYM-7kFj1vU",
  authDomain: "shopping-list-c5094.firebaseapp.com",
  databaseURL: "https://shopping-list-c5094-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shopping-list-c5094",
  storageBucket: "shopping-list-c5094.firebasestorage.app",
  messagingSenderId: "1000790903406",
  appId: "1:1000790903406:web:8aec9092b4a1599573f47f",
  measurementId: "G-LNM76JR6KK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const listRef = ref(db, 'shoppingLists/mojaLista/items');

// === Funkcje ===
function renderList(data) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name;
    li.className = item.toBuy ? "to-buy" : "";
    li.onclick = () => toggleItem(item.id, !item.toBuy);
    list.appendChild(li);
  });
}

function renderToBuy(data) {
  const list = document.getElementById("to-buy-list");
  list.innerHTML = "";
  data.filter(i => i.toBuy).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name;
    li.onclick = () => toggleItem(item.id, false);
    list.appendChild(li);
  });
}

function renderCategories(data) {
  const cats = [...new Set(data.map(i => i.category))];
  const list = document.getElementById("category-list");
  list.innerHTML = "";
  cats.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    list.appendChild(li);
  });
}

function toggleItem(id, toBuy) {
  const itemRef = ref(db, `shoppingLists/mojaLista/items/${id}`);
  update(itemRef, { toBuy });
}

// === Obsługa DOM ===
document.addEventListener("DOMContentLoaded", () => {
  onValue(listRef, snap => {
    const data = Object.values(snap.val() || {});
    renderList(data);
    renderToBuy(data);
    renderCategories(data);
  });

  document.getElementById("search").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    onValue(listRef, snap => {
      const data = Object.values(snap.val() || {});
      const filtered = data.filter(item => item.name.toLowerCase().includes(q));
      renderList(filtered);
    });
  });

  if (!localStorage.getItem("cookieConsent")) {
    document.getElementById("cookie-banner").style.display = "block";
  }
});

window.acceptCookies = () => {
  localStorage.setItem("cookieConsent", "true");
  document.getElementById("cookie-banner").style.display = "none";
};
