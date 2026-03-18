<template>
  <aside
    class="glass-cart fixed bottom-20 right-4 z-50 flex w-full max-w-sm flex-col overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 transform origin-bottom-right"
    :class="showCart ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'"
  >
    <div class="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <h3 class="text-lg font-bold text-slate-800">Your Cart</h3>
      <button
        class="rounded-full bg-white/20 p-2 text-slate-700 backdrop-blur-md transition-colors hover:bg-white/40"
        @click="emit('close')"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <div class="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-slate-800 scrollbar-hide">
      <p
        v-if="!cartEntries.length"
        class="rounded-xl bg-white/20 px-4 py-8 text-center text-sm font-medium text-slate-600 backdrop-blur-sm"
      >
        Your cart is empty.
      </p>

      <div
        v-for="entry in cartEntries"
        :key="entry.id"
        class="flex items-center gap-4 rounded-2xl bg-white/20 p-3 shadow-sm ring-1 ring-white/30 backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/30"
      >
        <img
          v-if="entry.imageUrl"
          :src="entry.imageUrl"
          class="h-16 w-16 shrink-0 rounded-xl object-cover shadow-sm"
          alt=""
        />
        <div
          v-else
          class="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-white/40 text-2xl shadow-sm backdrop-blur-md"
        >
          🍽
        </div>

        <div class="flex flex-1 flex-col">
          <p class="text-sm font-bold text-slate-900 line-clamp-1">{{ entry.name }}</p>
          <p class="mt-0.5 text-xs font-semibold text-indigo-700">
            Rs {{ formatCurrency(entry.price) }}
          </p>
          
          <div class="mt-2 flex items-center justify-between">
            <div class="flex items-center gap-3 rounded-full bg-white/40 px-2 py-0.5 shadow-inner backdrop-blur-sm">
              <button
                class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                @click="updateQuantity(entry.id, -1)"
              >
                <Minus class="h-3 w-3" />
              </button>
              <span class="w-4 text-center text-xs font-bold text-slate-800">{{ entry.qty }}</span>
              <button
                class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-transform hover:scale-110 active:scale-95"
                @click="updateQuantity(entry.id, 1)"
              >
                <Plus class="h-3 w-3" />
              </button>
            </div>
            <button
              class="rounded-full bg-rose-50 p-1.5 text-rose-500 transition-colors hover:bg-rose-100"
              title="Remove Item"
              @click="removeFromCart(entry.id)"
            >
              <Trash2 class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-white/20 bg-white/30 px-5 pt-3 pb-5 backdrop-blur-xl">
      <div class="mb-3 flex items-center justify-between px-1">
        <span class="text-sm font-medium text-slate-700">Total</span>
        <span class="text-xl font-black text-slate-900 shadow-sm" style="text-shadow: 0 1px 2px rgba(255,255,255,0.5);">
          Rs {{ formatCurrency(cartTotal) }}
        </span>
      </div>
      
      <button
        class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        :disabled="ordering || !cartEntries.length"
        @click="handlePlaceOrder"
      >
        <Banknote v-if="!ordering" class="h-4 w-4" />
        {{ ordering ? "Processing Order..." : "Place Order" }}
      </button>

      <div
        v-if="orderSuccess"
        class="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-2 ring-1 ring-emerald-500/30 backdrop-blur-md"
      >
        <p class="text-xs font-semibold text-emerald-800">✅ Order placed! Pay at counter.</p>
        <button
          class="ml-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
          @click="emit('go-orders')"
        >
          View Orders →
        </button>
      </div>

      <p
        v-if="orderError"
        class="mt-3 rounded-xl bg-rose-500/10 px-4 py-2 text-center text-xs font-semibold text-rose-800 ring-1 ring-rose-500/30 backdrop-blur-md"
      >
        {{ orderError }}
      </p>
    </div>
  </aside>
</template>

<script setup>
import { Banknote, Minus, Plus, Trash2, X } from "lucide-vue-next";
import { ref } from "vue";
import { formatCurrency } from "../utils/currency.js";
import {
  cartCount,
  cartEntries,
  cartTotal,
  placeOrder,
  removeFromCart,
  updateQuantity
} from "../stores/cartStore.js";

const props = defineProps(["showCart"]);
const emit = defineEmits(["close", "go-orders"]);

const ordering = ref(false);
const orderSuccess = ref(false);
const orderError = ref("");

async function handlePlaceOrder() {
  ordering.value = true;
  orderError.value = "";
  orderSuccess.value = false;

  try {
    await placeOrder();
    orderSuccess.value = true;
  } catch (e) {
    orderError.value = e.message;
  } finally {
    ordering.value = false;
  }
}
</script>

<style scoped>
.glass-cart {
  /* Apple Liquid Glass Effect */
  backdrop-filter: blur(15px) saturate(180%);
  -webkit-backdrop-filter: blur(15px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.4);
  background-image: linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0));
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  
  /* Layout constraints */
  max-height: 65vh;
}

/* Hide scrollbar for cleaner look */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
