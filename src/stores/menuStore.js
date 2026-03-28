import { ref } from 'vue';
import { MenuAPI } from '../api/index.js';

const categories = ref([]);
const categoriesLoaded = ref(false);

/**
 * Get categories from cache or fetch if not loaded
 */
export async function getCategories() {
  if (!categoriesLoaded.value) {
    categories.value = await MenuAPI.getCategories();
    categoriesLoaded.value = true;
  }
  return categories.value;
}

export function getLoadedCategories() {
  return categories;
}
