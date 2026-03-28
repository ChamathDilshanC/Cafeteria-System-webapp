<template>
  <section class="space-y-6">
    <div
      class="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/25 p-5 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5"
    >
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
          Discover Menu
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Smart ordering with rich item previews and instant cart.
        </p>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-xl border border-indigo-200/60 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:from-blue-100/60 hover:to-indigo-100/60 hover:shadow-md dark:border-indigo-500/30 dark:from-indigo-900/20 dark:to-blue-900/20 dark:text-indigo-300 dark:hover:from-indigo-900/40 dark:hover:to-blue-900/40"
        @click="loadItems"
      >
        <RefreshCcw class="h-4 w-4" />
        Refresh
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        class="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300"
        :class="
          !selectedCategory
            ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500 dark:hover:bg-indigo-600'
            : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400'
        "
        @click="selectCategory(null)"
      >
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300"
        :class="
          selectedCategory === cat.id
            ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500 dark:hover:bg-indigo-600'
            : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400'
        "
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
      </button>
    </div>

    <p
      v-if="!items.length && !loading"
      class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-8 text-center text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
    >
      ⚠️ No items available in this category.
    </p>

    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <FoodMenuItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @add-to-cart="handleAddToCart"
      />
    </div>

    <button
      v-if="cartCount > 0"
      :class="[
        'fixed bottom-5 right-5 z-[60] inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-white/20',
        cartAnimating ? 'animate-cart-pulse' : '',
      ]"
      @click="showCart = !showCart"
    >
      <ShoppingCart class="h-4 w-4" />
      {{ cartCount }} item(s) · Rs {{ formatCurrency(cartTotal) }}
    </button>

    <Cart
      :showCart="showCart"
      @close="showCart = false"
      @go-orders="emit('go-orders')"
    />
  </section>
</template>

<style scoped>
@keyframes cart-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }
  100% {
    transform: scale(1);
  }
}

.animate-cart-pulse {
  animation: cart-pulse 0.6s ease-out;
}
</style>

<script setup>
import { RefreshCcw, ShoppingCart } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { MenuAPI } from '../api/index.js';
import { addToCart, cartCount, cartTotal } from '../stores/cartStore.js';
import { getCategories, getLoadedCategories } from '../stores/menuStore.js';
import { formatCurrency } from '../utils/currency.js';
import Cart from './Cart.vue';
import FoodMenuItemCard from './FoodMenuItemCard.vue';

const props = defineProps(['user']);
const emit = defineEmits(['go-orders']);

const categories = getLoadedCategories();
const items = ref([]);
const selectedCategory = ref(null);
const loading = ref(false);
const showCart = ref(false);
const cartAnimating = ref(false);

onMounted(async () => {
  // Load categories from cache (only fetches once)
  await getCategories();
  await loadItems();
});

async function selectCategory(id) {
  selectedCategory.value = id;
  await loadItems();
}

async function loadItems() {
  loading.value = true;
  try {
    items.value = await MenuAPI.getItems(selectedCategory.value);
  } finally {
    loading.value = false;
  }
}

function handleAddToCart(item) {
  addToCart(item.id, item.name, item.price);
  triggerCartAnimation();
}

function triggerCartAnimation() {
  cartAnimating.value = true;
  setTimeout(() => {
    cartAnimating.value = false;
  }, 600);
}
</script>
