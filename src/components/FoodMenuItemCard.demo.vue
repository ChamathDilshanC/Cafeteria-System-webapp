<template>
  <div class="min-h-screen bg-slate-50 p-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">
          Food Menu Item Card - Demo
        </h1>
        <p class="mt-2 text-slate-600">
          Showcasing different states and configurations
        </p>
      </div>

      <!-- Available Items -->
      <section class="mb-12">
        <h2 class="mb-4 text-xl font-semibold text-slate-800">
          Available Items
        </h2>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FoodMenuItemCard
            v-for="item in availableItems"
            :key="item.id"
            :item="item"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>

      <!-- Out of Stock Items -->
      <section class="mb-12">
        <h2 class="mb-4 text-xl font-semibold text-slate-800">
          Out of Stock Items
        </h2>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FoodMenuItemCard
            v-for="item in outOfStockItems"
            :key="item.id"
            :item="item"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>

      <!-- Items Without Images -->
      <section>
        <h2 class="mb-4 text-xl font-semibold text-slate-800">
          Items Without Images (Placeholder)
        </h2>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FoodMenuItemCard
            v-for="item in noImageItems"
            :key="item.id"
            :item="item"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>

      <!-- Toast Notification -->
      <div
        v-if="showToast"
        class="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-lg"
      >
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FoodMenuItemCard from "./FoodMenuItemCard.vue";

const showToast = ref(false);
const toastMessage = ref("");

// Sample data with different availability states
const availableItems = ref([
  {
    id: 1,
    name: "Kottu",
    description: "Kottu Meal - Traditional Sri Lankan stir-fried flatbread with vegetables and spices",
    price: 1500.0,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    available: true,
  },
  {
    id: 2,
    name: "Rice & Curry",
    description: "Traditional Sri Lankan rice served with assorted curries and sambols",
    price: 850.0,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    isAvailable: true, // Alternative field name
  },
  {
    id: 3,
    name: "String Hoppers",
    description: "Steamed rice noodles served with coconut sambol and dhal curry",
    price: 450.0,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    // No availability field = defaults to true
  },
]);

const outOfStockItems = ref([
  {
    id: 4,
    name: "Lamprais",
    description: "Dutch Burgher dish with rice, curry, and sambol wrapped in banana leaf",
    price: 1200.0,
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    available: false,
  },
  {
    id: 5,
    name: "Hoppers",
    description: "Bowl-shaped pancakes made from fermented rice flour",
    price: 350.0,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
    isAvailable: false,
  },
]);

const noImageItems = ref([
  {
    id: 6,
    name: "Pittu",
    description: "Steamed cylinders of ground rice layered with coconut",
    price: 400.0,
    available: true,
  },
  {
    id: 7,
    name: "Watalappan",
    description: "Traditional Sri Lankan dessert made with coconut milk and jaggery",
    price: 350.0,
    available: false,
  },
]);

function handleAddToCart(item) {
  toastMessage.value = `Added "${item.name}" to cart!`;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 2000);

  console.log("Item added to cart:", item);
}
</script>
