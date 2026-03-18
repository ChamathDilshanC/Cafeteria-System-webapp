/**
 * app.js  —  UI logic; depends on api.js being loaded first.
 */

// ── State ─────────────────────────────────────────────────────────────────────
const cart = {}; // { menuItemId: { name, price, qty } }

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document
    .getElementById("register-form")
    .addEventListener("submit", handleRegister);

  if (_token) {
    setLoggedIn();
    showSection("menu-section");
    loadMenu();
  } else {
    showSection("login-section");
  }
});

// ── Navigation ────────────────────────────────────────────────────────────────
function showSection(id) {
  document
    .querySelectorAll(".card")
    .forEach((c) => c.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");

  if (id === "menu-section") loadMenu();
  if (id === "order-section") loadOrders();
  if (id === "kitchen-section") loadKitchenOrders();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errEl = document.getElementById("login-error");

  try {
    const res = await AuthAPI.login(email, password);
    setToken(res.token);
    setLoggedIn();
    showSection("menu-section");
    errEl.classList.add("hidden");
  } catch (err) {
    showMessage(errEl, err.message, "error");
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;
  const msgEl = document.getElementById("register-msg");

  try {
    await AuthAPI.register(name, email, password, role);
    showMessage(msgEl, "Account created! Please log in.", "success");
    setTimeout(() => showSection("login-section"), 1500);
  } catch (err) {
    showMessage(msgEl, err.message, "error");
  }
}

function setLoggedIn() {
  document.getElementById("auth-area").innerHTML =
    `<button onclick="logout()">Logout</button>`;
}

function logout() {
  clearToken();
  location.reload();
}

// ── Menu ──────────────────────────────────────────────────────────────────────
async function loadMenu(categoryId = null) {
  const [categories, items] = await Promise.all([
    MenuAPI.getCategories(),
    MenuAPI.getItems(categoryId),
  ]);

  renderCategories(categories, categoryId);
  renderItems(items);
}

function renderCategories(cats, activeId) {
  const bar = document.getElementById("menu-categories");
  bar.innerHTML = `<span class="chip ${!activeId ? "active" : ""}" onclick="loadMenu()">All</span>`;
  (cats || []).forEach((c) => {
    bar.innerHTML += `<span class="chip ${c.id === activeId ? "active" : ""}"
            onclick="loadMenu(${c.id})">${c.name}</span>`;
  });
}

function renderItems(items) {
  const grid = document.getElementById("menu-grid");
  if (!items || items.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted)">No items available.</p>';
    return;
  }
  grid.innerHTML = items
    .map(
      (item) => `
        <div class="item-card">
            <img src="${item.imageUrl || "https://placehold.co/200x130?text=Food"}" alt="${item.name}" />
            <div class="item-body">
                <div class="item-name">${item.name}</div>
                <div class="item-price">RM ${Number(item.price).toFixed(2)}</div>
                <div class="item-desc">${item.description || ""}</div>
                <button onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
            </div>
        </div>`,
    )
    .join("");
}

function addToCart(id, name, price) {
  if (cart[id]) cart[id].qty++;
  else cart[id] = { name, price, qty: 1 };
  refreshCartBar();
}

function refreshCartBar() {
  const total = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  const bar = document.getElementById("cart-summary");
  document.getElementById("cart-count").textContent =
    `${total} item${total !== 1 ? "s" : ""}`;
  bar.classList.toggle("hidden", total === 0);
}

// ── Orders ────────────────────────────────────────────────────────────────────
async function placeOrder() {
  if (!_token) {
    showSection("login-section");
    return;
  }
  const items = Object.entries(cart).map(([menuItemId, v]) => ({
    menuItemId: Number(menuItemId),
    quantity: v.qty,
  }));
  try {
    await OrderAPI.placeOrder(items);
    Object.keys(cart).forEach((k) => delete cart[k]);
    refreshCartBar();
    alert("Order placed successfully!");
    showSection("order-section");
  } catch (err) {
    alert("Failed to place order: " + err.message);
  }
}

async function loadOrders() {
  const list = document.getElementById("order-list");
  try {
    const orders = await OrderAPI.getMyOrders();
    list.innerHTML =
      (orders || [])
        .map(
          (o) => `
            <div class="order-card">
                <div class="order-header">
                    <strong>Order #${o.id}</strong>
                    <span class="badge ${o.status}">${o.status}</span>
                </div>
                <div>${(o.items || []).map((i) => `${i.name} x${i.quantity}`).join(", ")}</div>
                <div style="margin-top:.5rem;color:var(--muted);font-size:.85rem">
                    Total: RM ${Number(o.totalAmount).toFixed(2)} &nbsp;|&nbsp;
                    ${new Date(o.createdAt).toLocaleString()}
                </div>
            </div>`,
        )
        .join("") || '<p style="color:var(--muted)">No orders yet.</p>';
  } catch (err) {
    list.innerHTML = `<p class="error-msg error">${err.message}</p>`;
  }
}

// ── Kitchen ───────────────────────────────────────────────────────────────────
async function loadKitchenOrders() {
  const list = document.getElementById("kitchen-list");
  try {
    const tickets = await KitchenAPI.getQueue();
    list.innerHTML =
      (tickets || [])
        .map(
          (t) => `
            <div class="order-card">
                <div class="order-header">
                    <strong>Ticket #${t.id} — Order #${t.orderId}</strong>
                    <span class="badge ${t.status}">${t.status}</span>
                </div>
                <div>${(t.items || []).map((i) => `${i.name} x${i.quantity}`).join(", ")}</div>
                <div style="margin-top:.5rem;display:flex;gap:.5rem">
                    <button onclick="updateKitchenStatus('${t.id}','PREPARING')">Preparing</button>
                    <button onclick="updateKitchenStatus('${t.id}','READY')">Ready</button>
                    <button onclick="updateKitchenStatus('${t.id}','COMPLETED')">Completed</button>
                </div>
            </div>`,
        )
        .join("") || '<p style="color:var(--muted)">Queue is empty.</p>';
  } catch (err) {
    list.innerHTML = `<p class="error-msg error">${err.message}</p>`;
  }
}

async function updateKitchenStatus(ticketId, status) {
  try {
    await KitchenAPI.updateStatus(ticketId, status);
    loadKitchenOrders();
  } catch (err) {
    alert("Update failed: " + err.message);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function showMessage(el, msg, type) {
  el.textContent = msg;
  el.className = `error-msg ${type}`;
}
