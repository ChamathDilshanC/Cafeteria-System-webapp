import { reactive, computed } from "vue";
import { OrderAPI } from "../api/index.js";

// Global singleton state for the cart
export const cart = reactive({});

export const cartEntries = computed(() =>
  Object.entries(cart).map(([id, entry]) => ({ id, ...entry }))
);

export const cartCount = computed(() =>
  Object.values(cart).reduce((sum, entry) => sum + entry.qty, 0)
);

export const cartTotal = computed(() =>
  Object.values(cart).reduce((sum, entry) => sum + entry.price * entry.qty, 0)
);

export function addToCart(item) {
  if (cart[item.id]) {
    cart[item.id].qty += 1;
    return;
  }

  cart[item.id] = {
    name: item.name,
    price: Number(item.price),
    imageUrl: item.imageUrl,
    qty: 1,
  };
}

export function removeFromCart(id) {
  delete cart[id];
}

export function updateQuantity(id, change) {
  if (!cart[id]) return;
  const newQty = cart[id].qty + change;
  if (newQty <= 0) {
    removeFromCart(id);
  } else {
    cart[id].qty = newQty;
  }
}

export function clearCart() {
  Object.keys(cart).forEach((key) => delete cart[key]);
}

export async function placeOrder() {
  const orderItems = Object.entries(cart).map(([id, entry]) => ({
    menuItemId: Number(id),
    quantity: entry.qty,
  }));

  if (orderItems.length === 0) throw new Error("Cart is empty");

  await OrderAPI.place({ items: orderItems });
  clearCart();
}
