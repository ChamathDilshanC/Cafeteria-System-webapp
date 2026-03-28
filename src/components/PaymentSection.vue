<template>
  <section class="space-y-6">
    <div
      class="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/25 p-5 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5"
    >
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
          Payment Verification
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Approve cash payments received at the counter to send orders to
          kitchen.
        </p>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-xl border border-indigo-200/60 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:from-blue-100/60 hover:to-indigo-100/60 hover:shadow-md dark:border-indigo-500/30 dark:from-indigo-900/20 dark:to-blue-900/20 dark:text-indigo-300 dark:hover:from-indigo-900/40 dark:hover:to-blue-900/40"
        @click="load"
      >
        <RefreshCcw class="h-4 w-4" />
        Refresh
      </button>
    </div>

    <p
      v-if="loading"
      class="rounded-xl border border-white/15 bg-white/25 px-4 py-8 text-center text-sm text-slate-500 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
    >
      Loading pending payments...
    </p>
    <p
      v-else-if="!orders.length"
      class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-8 text-center text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
    >
      ✅ No pending payments. All orders are settled.
    </p>

    <div v-else class="space-y-4">
      <article
        v-for="order in orders"
        :key="order.id"
        class="rounded-2xl border border-amber-200 bg-white p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl dark:border-amber-900 dark:bg-slate-800/30"
      >
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Order</p>
            <h3 class="text-lg font-bold text-slate-900">#{{ order.id }}</h3>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ formatDate(order.createdAt) }}
            </p>
          </div>
          <div class="flex gap-2">
            <span
              class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800"
            >
              💵 UNPAID
            </span>
            <span
              class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
            >
              {{ order.status }}
            </span>
          </div>
        </div>

        <div
          class="overflow-x-auto rounded-xl border border-white/15 dark:border-white/10"
        >
          <table class="min-w-full divide-y divide-slate-200 text-sm">
            <thead
              class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"
            >
              <tr>
                <th class="px-4 py-3">Item</th>
                <th class="px-4 py-3">Qty</th>
                <th class="px-4 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
              <tr v-for="item in order.items" :key="item.menuItemId">
                <td class="px-4 py-3 font-medium">{{ item.itemName }}</td>
                <td class="px-4 py-3">{{ item.quantity }}</td>
                <td class="px-4 py-3">
                  Rs {{ formatCurrency(item.subtotal) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-base font-bold text-slate-900">
              Total: Rs {{ formatCurrency(order.totalAmount) }}
            </p>
            <p v-if="order.notes" class="text-xs text-indigo-600 mt-0.5">
              📝 {{ order.notes }}
            </p>
          </div>
          <div class="flex gap-2">
            <p v-if="errors[order.id]" class="text-xs text-rose-500">
              {{ errors[order.id] }}
            </p>
            <button
              class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-sm disabled:opacity-60"
              :disabled="approving === order.id"
              @click="approvePayment(order.id)"
            >
              <CheckCircle class="h-4 w-4" />
              {{ approving === order.id ? 'Approving...' : 'Approve Payment' }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { CheckCircle, RefreshCcw } from 'lucide-vue-next';
import { onMounted, reactive, ref } from 'vue';
import { OrderAPI } from '../api/index.js';
import { formatCurrency } from '../utils/currency.js';

const orders = ref([]);
const loading = ref(false);
const approving = ref(null);
const errors = reactive({});

onMounted(load);

async function load() {
  loading.value = true;
  try {
    const data = await OrderAPI.getPendingPayment();
    // Filter out canceled orders so they don't show up in the payment section
    orders.value = data.filter(order => order.status !== 'CANCELLED');
  } finally {
    loading.value = false;
  }
}

async function approvePayment(id) {
  approving.value = id;
  delete errors[id];
  try {
    await OrderAPI.verifyPayment(id);
    await load();
  } catch (e) {
    errors[id] = e.message;
  } finally {
    approving.value = null;
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}
</script>
