<template>
  <section class="space-y-6">
    <div
      class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Discover Menu</h2>
        <p class="text-sm text-slate-500">
          Smart ordering with rich item previews and instant cart.
        </p>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm"
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
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
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
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
        "
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
      </button>
    </div>

    <p
      v-if="loading"
      class="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500"
    >
      Loading menu...
    </p>
    <p
      v-else-if="!items.length"
      class="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500"
    >
      No items available in this category.
    </p>

    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <FoodMenuItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @add-to-cart="addToCart"
      />
    </div>

    <button
      v-if="cartCount > 0"
      class="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-slate-800"
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

<script setup>
import { onMounted, ref } from "vue";
import { RefreshCcw, ShoppingCart } from "lucide-vue-next";
import { MenuAPI } from "../api/index.js";
import { formatCurrency } from "../utils/currency.js";
import { cartCount, cartTotal, addToCart } from "../stores/cartStore.js";
import Cart from "./Cart.vue";
import FoodMenuItemCard from "./FoodMenuItemCard.vue";

const props = defineProps(["user"]);
const emit = defineEmits(["go-orders"]);

const categories = ref([]);
const items = ref([]);
const selectedCategory = ref(null);
const loading = ref(false);
const showCart = ref(false);

onMounted(async () => {
  categories.value = await MenuAPI.getCategories();
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

</script>
