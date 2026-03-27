<template>
  <article
    class="group relative overflow-hidden rounded-[2rem] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-[320px] w-full max-w-sm flex flex-col justify-end isolate bg-transparent z-0"
    style="backface-visibility: hidden; transform: translate3d(0, 0, 0)"
  >
    <!-- Background Image -->
    <img
      v-if="item.imageUrl"
      :src="item.imageUrl"
      :alt="item.name"
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div
      v-else
      class="absolute inset-0 grid h-full w-full place-items-center bg-slate-800 text-6xl"
    >
      🍽
    </div>

    <!-- Gradient Overlay (Fade effect) -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent h-full"
    ></div>

    <!-- Availability Badge (Top-Left) -->
    <span
      v-if="!isAvailable"
      class="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm bg-red-500/90 text-white backdrop-blur-sm"
    >
      Out of Stock
    </span>

    <!-- Content Section -->
    <div class="relative z-10 p-5 flex flex-col gap-2">
      <!-- Availability -->
      <div class="flex">
        <span
          class="px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest rounded-full backdrop-blur-md border shadow-sm"
          :class="
            isAvailable
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          "
        >
          {{ isAvailable ? 'Available' : 'Out of Stock' }}
        </span>
      </div>

      <!-- Divider -->
      <hr class="border-t border-white/20 my-0.5" />

      <!-- Bottom Details -->
      <div class="flex flex-col">
        <div class="flex items-center justify-between gap-1">
          <span
            class="text-sm font-semibold text-white drop-shadow-sm truncate"
          >
            {{ item.name }}
          </span>
          <span
            class="text-sm font-bold text-[#d4df87] drop-shadow-sm whitespace-nowrap"
          >
            Rs {{ formatCurrency(item.price) }}
          </span>
        </div>
        <p
          class="text-[0.7rem] text-gray-300 line-clamp-2 leading-tight mt-0.5"
        >
          {{ item.description || 'Chef special from our curated menu.' }}
        </p>
      </div>

      <!-- Divider -->
      <hr class="border-t border-white/20 my-0.5" />

      <!-- Add to Cart Button -->
      <button
        class="mt-0.5 w-full rounded-full py-2.5 text-sm font-bold transition-all duration-300 shadow-sm"
        :class="
          isAvailable
            ? 'bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-white/20 text-white/50 cursor-not-allowed backdrop-blur-sm'
        "
        :disabled="!isAvailable"
        @click="handleAddToCart"
      >
        {{ isAvailable ? 'Add to Cart' : 'Unavailable' }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { formatCurrency } from '../utils/currency.js';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['add-to-cart']);

// Compute availability - handles different field names
const isAvailable = computed(() => {
  // Check for various possible field names
  if (props.item.hasOwnProperty('available')) {
    return props.item.available;
  }
  if (props.item.hasOwnProperty('isAvailable')) {
    return props.item.isAvailable;
  }
  if (props.item.hasOwnProperty('inStock')) {
    return props.item.inStock;
  }
  // Default to true if no availability field exists
  return true;
});

function handleAddToCart() {
  if (isAvailable.value) {
    emit('add-to-cart', props.item);
  }
}
</script>
