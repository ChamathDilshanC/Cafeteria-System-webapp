<template>
  <section class="space-y-8">
    <!-- ── Categories ─────────────────────────────────────────── -->
    <div class="rounded-2xl border border-white/15 bg-white/25 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Manage Categories</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Add, edit or remove menu categories.
          </p>
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          @click="openCatForm()"
        >
          + New Category
        </button>
      </div>

      <div
        v-if="catForm.open"
        class="mb-4 flex gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950"
      >
        <input
          v-model="catForm.name"
          placeholder="Category name"
          class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-800"
        />
        <input
          v-model="catForm.description"
          placeholder="Description (optional)"
          class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-800"
        />
        <button
          class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          :disabled="!catForm.name.trim()"
          @click="saveCategory"
        >
          {{ catForm.id ? "Update" : "Create" }}
        </button>
        <button
          class="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
          @click="catForm.open = false"
        >
          Cancel
        </button>
      </div>

      <p
        v-if="catError"
        class="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-950 dark:text-rose-200"
      >
        {{ catError }}
      </p>

      <div class="overflow-x-auto rounded-xl border border-white/15 dark:border-white/10">
        <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <thead
            class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400"
          >
            <tr>
              <th class="px-4 py-3 text-left">ID</th>
              <th class="px-4 py-3 text-left">Name</th>
              <th class="px-4 py-3 text-left">Description</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800">
            <tr v-for="cat in categories" :key="cat.id">
              <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ cat.id }}</td>
              <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">
                {{ cat.name }}
              </td>
              <td class="px-4 py-3 text-slate-500 dark:text-slate-400">
                {{ cat.description || "—" }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex gap-6 justify-end">
                  <button
                    class="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    @click="openCatForm(cat)"
                  >
                    Edit
                  </button>
                  <button
                    class="text-xs font-semibold text-rose-500 hover:underline dark:text-rose-400"
                    @click="deleteCategory(cat.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!categories.length">
              <td colspan="4" class="px-4 py-6 text-center text-slate-400 dark:text-slate-500">
                No categories yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Menu Items ──────────────────────────────────────────── -->
    <div class="rounded-2xl border border-white/15 bg-white/25 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Manage Menu Items</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Create, edit or delete menu items with optional image upload.
          </p>
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          @click="openItemForm()"
        >
          + New Item
        </button>
      </div>

      <!-- Item Form -->
      <div
        v-if="itemForm.open"
        class="mb-5 space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950"
      >
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            v-model="itemForm.name"
            placeholder="Name *"
            class="input-field"
          />
            <input
              v-model="itemForm.price"
              type="number"
              step="0.01"
              placeholder="Price (Rs) *"
              class="input-field"
            />
          <textarea
            v-model="itemForm.description"
            placeholder="Description"
            rows="2"
            class="input-field sm:col-span-2"
          />
          <select v-model="itemForm.categoryId" class="input-field">
            <option value="">Select category *</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <label
            class="flex items-center gap-2"
          >
            <input
              v-model="itemForm.available"
              type="checkbox"
              class="sr-only"
            />
            <span
              :class="
                itemForm.available
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              "
              class="rounded-full px-3 py-1 text-xs font-semibold inline-block transition-colors"
            >
              {{ itemForm.available ? '✓ AVAILABLE' : 'UNAVAILABLE' }}
            </span>
          </label>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-2 dark:text-slate-400"
            >Image (optional)</label
          >
          <div class="flex items-end gap-4">
            <label class="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
              <span>📁 Choose File</span>
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onImageChange"
              />
            </label>
            <img
              v-if="itemForm.previewUrl"
              :src="itemForm.previewUrl"
              class="h-24 w-24 rounded-xl object-cover border border-slate-200 shadow-sm dark:border-slate-700"
            />
          </div>
        </div>
        <p
          v-if="itemError"
          class="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-950 dark:text-rose-200"
        >
          {{ itemError }}
        </p>
        <div class="flex gap-2">
          <button
            class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            :disabled="
              itemSaving ||
              !itemForm.name ||
              !itemForm.price ||
              !itemForm.categoryId
            "
            @click="saveItem"
          >
            {{
              itemSaving
                ? "Saving..."
                : itemForm.id
                  ? "Update Item"
                  : "Create Item"
            }}
          </button>
          <button
            class="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
            @click="itemForm.open = false"
          >
            Cancel
          </button>
        </div>
      </div>

      <p
        v-if="itemError && !itemForm.open"
        class="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-950 dark:text-rose-200"
      >
        {{ itemError }}
      </p>

      <div class="overflow-x-auto rounded-xl border border-white/15 dark:border-white/10">
        <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <thead
            class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400"
          >
            <tr>
              <th class="px-4 py-3 text-left">Image</th>
              <th class="px-4 py-3 text-left">Name</th>
              <th class="px-4 py-3 text-left">Category</th>
              <th class="px-4 py-3 text-left">Price</th>
              <th class="px-4 py-3 text-left">Available</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800">
            <tr v-for="item in menuItems" :key="item.id">
              <td class="px-4 py-3">
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  class="h-10 w-10 rounded-lg object-cover"
                />
                <div
                  v-else
                  class="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-lg dark:bg-slate-700"
                >
                  🍽
                </div>
              </td>
              <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">
                {{ item.name }}
              </td>
              <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ item.categoryName }}</td>
              <td class="px-4 py-3 text-slate-700 dark:text-slate-300">
                Rs {{ formatCurrency(item.price) }}
              </td>
              <td class="px-4 py-3">
                <span
                  :class="
                    item.available
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                  "
                  class="rounded-full px-2 py-0.5 text-xs font-semibold"
                >
                  {{ item.available ? "Yes" : "No" }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex gap-6 justify-end">
                  <button
                    class="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    @click="openItemForm(item)"
                  >
                    Edit
                  </button>
                  <button
                    class="text-xs font-semibold text-rose-500 hover:underline dark:text-rose-400"
                    @click="deleteItem(item.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!menuItems.length">
              <td colspan="6" class="px-4 py-6 text-center text-slate-400 dark:text-slate-500">
                No menu items yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { MenuAPI } from "../api/index.js";
import { formatCurrency } from "../utils/currency.js";

const categories = ref([]);
const menuItems = ref([]);
const catError = ref("");
const itemError = ref("");
const itemSaving = ref(false);
const imageInput = ref(null);

const catForm = reactive({ open: false, id: null, name: "", description: "" });
const itemForm = reactive({
  open: false,
  id: null,
  name: "",
  description: "",
  price: "",
  categoryId: "",
  available: true,
  imageFile: null,
  previewUrl: null,
});

onMounted(load);

async function load() {
  [categories.value, menuItems.value] = await Promise.all([
    MenuAPI.getCategories(),
    MenuAPI.getItems(),
  ]);
}

// ── Categories ──────────────────────────────────────────────────────
function openCatForm(cat = null) {
  catError.value = "";
  Object.assign(catForm, {
    open: true,
    id: cat?.id ?? null,
    name: cat?.name ?? "",
    description: cat?.description ?? "",
  });
}

async function saveCategory() {
  catError.value = "";
  try {
    const payload = {
      name: catForm.name.trim(),
      description: catForm.description.trim(),
    };
    if (catForm.id) {
      await MenuAPI.updateCategory(catForm.id, payload);
    } else {
      await MenuAPI.createCategory(payload);
    }
    catForm.open = false;
    categories.value = await MenuAPI.getCategories();
  } catch (e) {
    catError.value = e.message;
  }
}

async function deleteCategory(id) {
  if (!confirm("Delete this category?")) return;
  try {
    await MenuAPI.deleteCategory(id);
    categories.value = await MenuAPI.getCategories();
  } catch (e) {
    catError.value = e.message;
  }
}

// ── Menu Items ──────────────────────────────────────────────────────
function openItemForm(item = null) {
  itemError.value = "";
  Object.assign(itemForm, {
    open: true,
    id: item?.id ?? null,
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item?.price ?? "",
    categoryId: item?.categoryId ?? "",
    available: item?.available ?? true,
    imageFile: null,
    previewUrl: item?.imageUrl ?? null,
  });
  if (imageInput.value) imageInput.value.value = "";
}

function onImageChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  itemForm.imageFile = file;
  itemForm.previewUrl = URL.createObjectURL(file);
}

async function saveItem() {
  itemError.value = "";
  itemSaving.value = true;
  try {
    const fd = new FormData();
    fd.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            name: itemForm.name,
            description: itemForm.description,
            price: parseFloat(itemForm.price),
            categoryId: Number(itemForm.categoryId),
            available: itemForm.available,
          }),
        ],
        { type: "application/json" },
      ),
    );
    if (itemForm.imageFile) fd.append("image", itemForm.imageFile);

    if (itemForm.id) {
      await MenuAPI.updateItem(itemForm.id, fd);
    } else {
      await MenuAPI.createItem(fd);
    }
    itemForm.open = false;
    menuItems.value = await MenuAPI.getItems();
  } catch (e) {
    itemError.value = e.message;
  } finally {
    itemSaving.value = false;
  }
}

async function deleteItem(id) {
  if (!confirm("Delete this menu item?")) return;
  try {
    await MenuAPI.deleteItem(id);
    menuItems.value = await MenuAPI.getItems();
  } catch (e) {
    itemError.value = e.message;
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-800;
}
</style>
