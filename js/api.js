/**
 * api.js  —  Thin HTTP client for all API Gateway calls.
 *
 * The gateway runs on port 8080 in local dev and is exposed via the
 * GCP VM's external IP in production. Swap GATEWAY_URL at deploy time.
 */

const GATEWAY_URL = window.GATEWAY_URL || "http://localhost:8080";

let _token = localStorage.getItem("auth_token") || null;

function setToken(t) {
  _token = t;
  localStorage.setItem("auth_token", t);
}

function clearToken() {
  _token = null;
  localStorage.removeItem("auth_token");
}

async function request(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${GATEWAY_URL}${path}`, opts);
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
const AuthAPI = {
  login: (email, password) =>
    request("POST", "/api/auth/login", { email, password }),
  register: (name, email, password, role) =>
    request("POST", "/api/auth/register", { name, email, password, role }),
};

// ── Menu ──────────────────────────────────────────────────────────────────────
const MenuAPI = {
  getCategories: () => request("GET", "/api/categories"),
  getItems: (categoryId) =>
    request("GET", `/api/menu?categoryId=${categoryId ?? ""}`),
  getItem: (id) => request("GET", `/api/menu/${id}`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
const OrderAPI = {
  placeOrder: (items) => request("POST", "/api/orders", { items }),
  getMyOrders: () => request("GET", "/api/orders/my"),
  cancelOrder: (id) => request("PUT", `/api/orders/${id}/cancel`),
};

// ── Kitchen ───────────────────────────────────────────────────────────────────
const KitchenAPI = {
  getQueue: () => request("GET", "/api/kitchen/queue"),
  updateStatus: (ticketId, status) =>
    request("PUT", `/api/kitchen/${ticketId}/status`, { status }),
};
