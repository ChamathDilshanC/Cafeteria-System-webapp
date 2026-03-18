// Central API client — all requests go through the API Gateway
const GATEWAY = import.meta.env.VITE_GATEWAY_URL || "http://localhost:8080";

function getToken() {
  return localStorage.getItem("auth_token");
}

function authHeaders() {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(method, path, body) {
  const res = await fetch(GATEWAY + path, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || res.statusText);
  }
  return res.status === 204 ? null : res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────
export const AuthAPI = {
  register: (data) => request("POST", "/api/auth/register", data),
  login: (data) => request("POST", "/api/auth/login", data),
};

// ── Menu & Categories ─────────────────────────────────────────────────
async function multipartRequest(method, path, formData) {
  const token = getToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(GATEWAY + path, { method, headers, body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || res.statusText);
  }
  return res.status === 204 ? null : res.json();
}

export const MenuAPI = {
  getCategories: () => request("GET", "/api/categories"),
  createCategory: (data) => request("POST", "/api/categories", data),
  updateCategory: (id, data) => request("PUT", `/api/categories/${id}`, data),
  deleteCategory: (id) => request("DELETE", `/api/categories/${id}`),

  getItems: (categoryId) =>
    request("GET", `/api/menu${categoryId ? `?categoryId=${categoryId}` : ""}`),
  getItem: (id) => request("GET", `/api/menu/${id}`),
  createItem: (formData) => multipartRequest("POST", "/api/menu", formData),
  updateItem: (id, formData) => multipartRequest("PUT", `/api/menu/${id}`, formData),
  deleteItem: (id) => request("DELETE", `/api/menu/${id}`),
};

// ── Orders ────────────────────────────────────────────────────────────
export const OrderAPI = {
  place: (data) => request("POST", "/api/orders", data),
  getMyOrders: () => request("GET", "/api/orders/my"),
  getPendingPayment: () => request("GET", "/api/orders/pending-payment"),
  verifyPayment: (id) => request("PUT", `/api/orders/${id}/verify-payment`),
  cancel: (id) => request("PUT", `/api/orders/${id}/cancel`),
};

// ── Kitchen ───────────────────────────────────────────────────────────
export const KitchenAPI = {
  getQueue: () => request("GET", "/api/kitchen/queue"),
  updateStatus: (ticketId, status) =>
    request("PUT", `/api/kitchen/tickets/${ticketId}/status`, { status }),
};
