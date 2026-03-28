<template>
  <div :class="isDark ? 'dark' : ''" class="min-h-screen w-full">
    <!-- Dark Mode Gradient Background -->
    <div
      v-if="isDark"
      class="fixed inset-0 z-0"
      style="
        background: radial-gradient(
          125% 125% at 50% 10%,
          #000000 40%,
          #2b0707 100%
        );
      "
    />

    <!-- Light Mode Gradient Background -->
    <div
      v-else
      class="fixed inset-0 z-0"
      style="
        background: radial-gradient(
          125% 125% at 50% 10%,
          #fff 40%,
          #7c3aed 100%
        );
      "
    />

    <!-- Content -->
    <div class="relative z-10">
      <header
        v-if="isLoggedIn"
        class="sticky top-2 z-30 mx-2 mt-2 rounded-2xl bg-white/70 backdrop-blur-md dark:bg-black/40 transition-colors"
      >
        <div
          class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-gray-400/50 bg-gray-400/40 backdrop-blur-md shadow-sm dark:border-gray-500/50 dark:bg-gray-500/40"
            >
              <img
                src="/logo.png"
                alt="Logo"
                class="h-full w-full object-cover"
              />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-300">
                Cafeteria Management System
              </p>
              <h1 class="text-md font-bold text-slate-900 dark:text-slate-50">
                Welcome,
              </h1>
            </div>
          </div>

          <div
            v-if="user"
            class="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 sm:flex dark:border-white/10 dark:bg-white/5"
          >
            <span
              class="text-sm font-medium text-slate-700 dark:text-slate-300"
              >{{ user.name }}</span
            >
            <span
              class="rounded-full px-2 py-0.5 text-xs font-semibold"
              :class="
                user.role === 'STAFF' || user.role === 'ADMIN'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
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
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-300 hover:shadow-sm dark:border-slate-600/30 dark:bg-slate-700/20 dark:text-slate-400 dark:hover:bg-slate-700/30"
              @click="toggleDarkMode"
              :title="isDark ? 'Light Mode' : 'Dark Mode'"
            >
              <Sun v-if="isDark" class="h-4 w-4" />
              <Moon v-else class="h-4 w-4" />
              <span>{{ isDark ? 'Light' : 'Dark' }}</span>
            </button>
            <button
              class="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white/60 px-3 py-2 text-sm font-medium text-rose-600 transition-all duration-300 hover:shadow-sm dark:border-rose-600/30 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30"
              @click="logout"
            >
              <LogOut class="h-4 w-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div v-if="!isLoggedIn" class="animate-fade-in">
          <div
            class="mb-8 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400"
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
  </div>
</template>

<script setup>
import {
  BanknoteIcon,
  ChefHat,
  LayoutGrid,
  LogOut,
  Moon,
  Receipt,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import AdminSection from './components/AdminSection.vue';
import AuthView from './components/AuthView.vue';
import KitchenSection from './components/KitchenSection.vue';
import MenuSection from './components/MenuSection.vue';
import OrderSection from './components/OrderSection.vue';
import PaymentSection from './components/PaymentSection.vue';
import { useDarkMode } from './composables/useDarkMode.js';

const view = ref('menu');
const user = ref(null);
const { isDark, toggleDarkMode } = useDarkMode();

const isLoggedIn = computed(() => !!user.value);
const isStaff = computed(
  () => user.value?.role === 'STAFF' || user.value?.role === 'ADMIN'
);

onMounted(() => {
  const stored = localStorage.getItem('auth_user');
  if (stored) {
    user.value = JSON.parse(stored);
  }
});

function onLogin(userData) {
  user.value = userData;
  // Staff/Admin defaults to Kitchen view; customers go to Menu
  view.value =
    userData.role === 'STAFF' || userData.role === 'ADMIN'
      ? 'payments'
      : 'menu';
}

function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  user.value = null;
}

function navButtonClass(targetView) {
  const base =
    'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-300';
  const active =
    'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm hover:bg-indigo-100 dark:border-indigo-400 dark:bg-indigo-600/20 dark:text-white dark:hover:bg-indigo-600/30';
  const idle =
    'border-slate-200 bg-white/60 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm dark:border-slate-600/30 dark:bg-slate-700/20 dark:text-slate-400 dark:hover:border-indigo-500/50 dark:hover:text-indigo-300';

  return `${base} ${view.value === targetView ? active : idle}`;
}
</script>

<style>
/* Hide scrollbar but keep scroll functionality */
::-webkit-scrollbar {
  display: none;
}

html,
body {
  -ms-overflow-style: none;
}

* {
  scrollbar-width: none;
}
</style>
