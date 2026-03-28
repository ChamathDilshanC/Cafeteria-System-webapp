<template>
  <section class="space-y-6">
    <div
      class="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/25 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Orders
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Track payment and fulfillment in real time.
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
      Loading orders...
    </p>
    <p
      v-else-if="!orders.length"
      class="rounded-xl border border-white/15 bg-white/25 px-4 py-8 text-center text-sm text-slate-500 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
    >
      No orders yet. Start by adding items from the menu.
    </p>

    <div v-else class="space-y-4">
      <article
        v-for="order in orders"
        :key="order.id"
        class="rounded-2xl border border-white/15 bg-white/25 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl dark:border-white/10 dark:bg-white/5"
      >
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p
              class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Order
            </p>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              #{{ order.id }}
            </h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span :class="statusClass(order.status)">{{ order.status }}</span>
            <span :class="paymentClass(order.paymentStatus)">{{
              order.paymentStatus
            }}</span>
          </div>
        </div>

        <div
          class="overflow-x-auto rounded-xl border border-white/15 dark:border-white/10"
        >
          <table
            class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700"
          >
            <thead
              class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400"
            >
              <tr>
                <th class="px-4 py-3">Item</th>
                <th class="px-4 py-3">Qty</th>
                <th class="px-4 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody
              class="divide-y divide-slate-100 bg-white text-slate-700 dark:divide-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
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
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Total: Rs {{ formatCurrency(order.totalAmount) }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ formatDate(order.createdAt) }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <div
              v-if="
                order.paymentStatus === 'UNPAID' && order.status !== 'CANCELLED'
              "
              class="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900 dark:bg-amber-950"
            >
              <span class="text-lg">💵</span>
              <div>
                <p
                  class="text-xs font-semibold text-amber-800 dark:text-amber-200"
                >
                  Awaiting Payment Approval
                </p>
                <p class="text-xs text-amber-600 dark:text-amber-300">
                  Please pay cash at the counter. Staff will approve.
                </p>
              </div>
            </div>
            <button
              v-if="
                order.status === 'PENDING' && order.paymentStatus !== 'PAID'
              "
              class="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition-all duration-300 hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-950"
              @click="cancel(order.id)"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { RefreshCcw } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { OrderAPI } from '../api/index.js';
import { formatCurrency } from '../utils/currency.js';

const props = defineProps(['user']);
const orders = ref([]);
const loading = ref(false);

onMounted(load);

async function load() {
  loading.value = true;
  try {
    orders.value = await OrderAPI.getMyOrders();
  } finally {
    loading.value = false;
  }
}

async function cancel(id) {
  await OrderAPI.cancel(id);
  await load();
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function statusClass(status) {
  const base = 'rounded-full px-2.5 py-1 text-xs font-semibold';
  const map = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-indigo-100 text-indigo-800',
    PREPARING: 'bg-orange-100 text-orange-800',
    READY: 'bg-emerald-100 text-emerald-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-rose-100 text-rose-700',
  };

  return `${base} ${map[status] || 'bg-slate-100 text-slate-700'}`;
}

function paymentClass(status) {
  const base = 'rounded-full px-2.5 py-1 text-xs font-semibold';
  const map = {
    UNPAID: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    REFUNDED: 'bg-slate-200 text-slate-700',
  };

  return `${base} ${map[status] || 'bg-slate-100 text-slate-700'}`;
}
</script>
