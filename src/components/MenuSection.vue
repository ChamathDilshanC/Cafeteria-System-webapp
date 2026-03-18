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
      <article
        v-for="item in items"
        :key="item.id"
        class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="relative h-44 overflow-hidden bg-slate-100">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.name"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            v-else
            class="grid h-full w-full place-items-center bg-gradient-to-br from-slate-100 to-slate-200 text-4xl"
          >
            🍽
          </div>
          <span
            class="absolute left-3 top-3 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
          >
            Rs {{ formatCurrency(item.price) }}
          </span>
        </div>

        <div class="space-y-3 p-4">
          <div>
            <h3 class="text-base font-semibold text-slate-900">
              {{ item.name }}
            </h3>
            <p class="mt-1 line-clamp-2 text-sm text-slate-500">
              {{ item.description || "Chef special from our curated menu." }}
            </p>
          </div>

          <button
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-lg"
            @click="addToCart(item)"
          >
            <Plus class="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </article>
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
import { Plus, RefreshCcw, ShoppingCart } from "lucide-vue-next";
import { MenuAPI } from "../api/index.js";
import { formatCurrency } from "../utils/currency.js";
import { cartCount, cartTotal, addToCart } from "../stores/cartStore.js";
import Cart from "./Cart.vue";

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
