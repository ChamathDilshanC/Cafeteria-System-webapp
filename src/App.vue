<template>
  <div
    class="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-indigo-50/40"
  >
    <header
      v-if="isLoggedIn"
      class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        <div class="flex items-center gap-3">
          <div
            class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm"
          >
            <UtensilsCrossed class="h-5 w-5" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">
              Cafeteria Management System
            </p>
            <h1 class="text-lg font-bold text-slate-900">Dashboard</h1>
          </div>
        </div>

        <div
          v-if="user"
          class="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex"
        >
          <span class="text-sm font-medium text-slate-700">{{
            user.name
          }}</span>
          <span
            class="rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="
              user.role === 'STAFF' || user.role === 'ADMIN'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-emerald-100 text-emerald-700'
            "
          >
            {{ user.role }}
          </span>
        </div>

        <nav class="flex flex-wrap items-center gap-2">
          <button :class="navButtonClass('menu')" @click="view = 'menu'">
            <LayoutGrid class="h-4 w-4" />
            <span>Menu</span>
          </button>
          <button :class="navButtonClass('orders')" @click="view = 'orders'">
            <Receipt class="h-4 w-4" />
            <span>Orders</span>
          </button>
          <button
            v-if="isStaff"
            :class="navButtonClass('payments')"
            @click="view = 'payments'"
          >
            <BanknoteIcon class="h-4 w-4" />
            <span>Payments</span>
          </button>
          <button
            v-if="isStaff"
            :class="navButtonClass('kitchen')"
            @click="view = 'kitchen'"
          >
            <ChefHat class="h-4 w-4" />
            <span>Kitchen</span>
          </button>
          <button
            v-if="isStaff"
            :class="navButtonClass('admin')"
            @click="view = 'admin'"
          >
            <Settings class="h-4 w-4" />
            <span>Admin</span>
          </button>
          <button
            class="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 transition-all duration-300 hover:shadow-sm"
            @click="logout"
          >
            <LogOut class="h-4 w-4" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div v-if="!isLoggedIn" class="animate-fade-in">
        <div
          class="mb-8 flex items-center justify-center gap-2 text-indigo-600"
        >
          <Sparkles class="h-5 w-5" />
          <p class="text-sm font-semibold uppercase tracking-[0.2em]">
            Premium Experience
          </p>
        </div>
        <AuthView @logged-in="onLogin" />
      </div>

      <div v-else class="animate-fade-in">
        <MenuSection
          v-if="view === 'menu'"
          :user="user"
          @go-orders="view = 'orders'"
        />
        <OrderSection v-else-if="view === 'orders'" />
        <PaymentSection v-else-if="view === 'payments'" />
        <KitchenSection v-else-if="view === 'kitchen'" />
        <AdminSection v-else-if="view === 'admin'" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  BanknoteIcon,
  ChefHat,
  LayoutGrid,
  LogOut,
  Receipt,
  Settings,
  Sparkles,
  UtensilsCrossed,
} from "lucide-vue-next";
import AuthView from "./components/AuthView.vue";
import AdminSection from "./components/AdminSection.vue";
import KitchenSection from "./components/KitchenSection.vue";
import MenuSection from "./components/MenuSection.vue";
import OrderSection from "./components/OrderSection.vue";
import PaymentSection from "./components/PaymentSection.vue";

const view = ref("menu");
const user = ref(null);

const isLoggedIn = computed(() => !!user.value);
const isStaff = computed(
  () => user.value?.role === "STAFF" || user.value?.role === "ADMIN",
);

onMounted(() => {
  const stored = localStorage.getItem("auth_user");
  if (stored) {
    user.value = JSON.parse(stored);
  }
});

function onLogin(userData) {
  user.value = userData;
  // Staff/Admin defaults to Kitchen view; customers go to Menu
  view.value =
    userData.role === "STAFF" || userData.role === "ADMIN"
      ? "payments"
      : "menu";
}

function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  user.value = null;
}

function navButtonClass(targetView) {
  const base =
    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-300";
  const active =
    "border-indigo-600 bg-indigo-600 text-white shadow-sm hover:bg-indigo-500";
  const idle =
    "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm";

  return `${base} ${view.value === targetView ? active : idle}`;
}
</script>
