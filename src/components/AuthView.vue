<template>
  <section class="mx-auto w-full max-w-md">
    <div
      class="rounded-2xl border border-white/15 bg-white/25 p-6 shadow-xl backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-white/5"
    >
      <div class="mb-6 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
        <button
          class="w-1/2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300"
          :class="
            mode === 'login'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          "
          @click="mode = 'login'"
        >
          Login
        </button>
        <button
          class="w-1/2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300"
          :class="
            mode === 'register'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          "
          @click="mode = 'register'"
        >
          Register
        </button>
      </div>

      <form
        v-if="mode === 'login'"
        class="space-y-4"
        @submit.prevent="handleLogin"
      >
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Access your smart cafeteria workspace.
          </p>
        </div>

        <label
          class="block text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          Email
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="you@example.com"
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-800"
          />
        </label>

        <label
          class="block text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          Password
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-800"
          />
        </label>

        <p
          v-if="error"
          class="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-950 dark:text-rose-200"
        >
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <form v-else class="space-y-4" @submit.prevent="handleRegister">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
            Create account
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Launch your cafeteria operations in seconds.
          </p>
        </div>

        <label
          class="block text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          Name
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Full name"
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-800"
          />
        </label>

        <label
          class="block text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          Email
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="you@example.com"
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-800"
          />
        </label>

        <label
          class="block text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          Password
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="Min 6 characters"
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-800"
          />
        </label>

        <label
          class="block text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          Role
          <select
            v-model="form.role"
            class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-indigo-800"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="STAFF">Staff</option>
          </select>
        </label>

        <p
          v-if="error"
          class="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-950 dark:text-rose-200"
        >
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {{ loading ? 'Creating...' : 'Create account' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { AuthAPI } from '../api/index.js';
import { useAlerts } from '../composables/useAlerts.js';

const emit = defineEmits(['logged-in']);
const mode = ref('login');
const form = reactive({ name: '', email: '', password: '', role: 'CUSTOMER' });
const error = ref('');
const loading = ref(false);
const { addAlert } = useAlerts();

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    const data = await AuthAPI.login({
      email: form.email,
      password: form.password,
    });
    saveAndEmit(data);
  } catch (e) {
    error.value = e.message;
    addAlert(e.message, 'error');
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  error.value = '';
  loading.value = true;
  try {
    const data = await AuthAPI.register(form);
    saveAndEmit(data);
    addAlert('Account created successfully!', 'success');
  } catch (e) {
    error.value = e.message;
    addAlert(e.message, 'error');
  } finally {
    loading.value = false;
  }
}

function saveAndEmit(data) {
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem(
    'auth_user',
    JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    })
  );

  emit('logged-in', {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
  });
}
</script>
