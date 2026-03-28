<template>
  <div
    class="fixed right-4 top-20 z-[9999] flex w-full max-w-sm flex-col gap-3 pointer-events-none sm:top-6 sm:right-6"
  >
    <TransitionGroup name="toast">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-xl transition-all duration-300"
        :class="{
          'border-emerald-200/80 bg-emerald-50/90 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-900/60 dark:text-emerald-200':
            alert.type === 'success',
          'border-rose-200/80 bg-rose-50/90 text-rose-800 dark:border-rose-500/30 dark:bg-rose-900/60 dark:text-rose-200':
            alert.type === 'error',
          'border-amber-200/80 bg-amber-50/90 text-amber-800 dark:border-amber-500/30 dark:bg-amber-900/60 dark:text-amber-200':
            alert.type === 'warning',
          'border-blue-200/80 bg-blue-50/90 text-blue-800 dark:border-blue-500/30 dark:bg-blue-900/60 dark:text-blue-200':
            alert.type === 'info',
        }"
      >
        <div class="mt-0.5 flex-shrink-0">
          <CheckCircle v-if="alert.type === 'success'" class="h-5 w-5" />
          <AlertCircle v-else-if="alert.type === 'error'" class="h-5 w-5" />
          <AlertTriangle v-else-if="alert.type === 'warning'" class="h-5 w-5" />
          <Info v-else class="h-5 w-5" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ alert.message }}</p>
        </div>
        <button
          @click="removeAlert(alert.id)"
          class="ml-2 inline-flex flex-shrink-0 items-center justify-center rounded-lg opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
        >
          <span class="sr-only">Close</span>
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from 'lucide-vue-next';
import { useAlerts } from '../composables/useAlerts.js';

const { alerts, removeAlert } = useAlerts();
</script>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
