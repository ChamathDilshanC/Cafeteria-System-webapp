<template>
  <section class="space-y-6">
    <div
      class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Kitchen Queue</h2>
        <p class="text-sm text-slate-500">
          Manage ticket progression with fast status actions.
        </p>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm"
        @click="load"
      >
        <RefreshCcw class="h-4 w-4" />
        Refresh
      </button>
    </div>

    <p
      v-if="loading"
      class="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500"
    >
      Loading queue...
    </p>
    <p
      v-else-if="!tickets.length"
      class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-8 text-center text-sm text-emerald-700"
    >
      All caught up. No active orders.
    </p>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="ticket in tickets"
        :key="ticket.id"
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Order</p>
            <h3 class="text-base font-bold text-slate-900">
              #{{ ticket.orderId }}
            </h3>
          </div>
          <span :class="statusClass(ticket.status)">{{ ticket.status }}</span>
        </div>

        <ul class="space-y-1 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          <li v-for="item in ticket.items" :key="item.menuItemId">
            <span class="font-semibold">{{ item.quantity }}x</span>
            {{ item.itemName }}
          </li>
        </ul>

        <p
          v-if="ticket.notes"
          class="mt-3 rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700"
        >
          {{ ticket.notes }}
        </p>

        <p class="mt-3 text-xs text-slate-500">
          {{ formatDate(ticket.createdAt) }}
        </p>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <button
            v-if="ticket.status === 'PENDING'"
            class="rounded-xl bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-200"
            @click="updateStatus(ticket.id, 'PREPARING')"
          >
            Start
          </button>
          <button
            v-if="ticket.status === 'PREPARING'"
            class="rounded-xl bg-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-200"
            @click="updateStatus(ticket.id, 'READY')"
          >
            Mark Ready
          </button>
          <button
            v-if="ticket.status === 'READY'"
            class="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
            @click="updateStatus(ticket.id, 'COMPLETED')"
          >
            Complete
          </button>
          <button
            v-if="
              ticket.status !== 'COMPLETED' && ticket.status !== 'CANCELLED'
            "
            class="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
            @click="updateStatus(ticket.id, 'CANCELLED')"
          >
            Cancel
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RefreshCcw } from "lucide-vue-next";
import { KitchenAPI } from "../api/index.js";

const tickets = ref([]);
const loading = ref(false);

onMounted(load);

async function load() {
  loading.value = true;
  try {
    tickets.value = await KitchenAPI.getQueue();
  } finally {
    loading.value = false;
  }
}

async function updateStatus(ticketId, status) {
  await KitchenAPI.updateStatus(ticketId, status);
  await load();
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

function statusClass(status) {
  const base = "rounded-full px-2.5 py-1 text-xs font-semibold";
  const map = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PREPARING: "bg-orange-100 text-orange-800",
    READY: "bg-emerald-100 text-emerald-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-rose-100 text-rose-700",
  };

  return `${base} ${map[status] || "bg-slate-100 text-slate-700"}`;
}
</script>
