import { ref } from 'vue';

// Global state created outside the composable so it's shared across the whole app
const alerts = ref([]);
let nextId = 0;

export function useAlerts() {
  const addAlert = (message, type = 'info', duration = 3000) => {
    const id = nextId++;
    alerts.value.push({ id, message, type });

    // Automatically remove the alert after the duration
    setTimeout(() => {
      removeAlert(id);
    }, duration);
  };

  const removeAlert = id => {
    const index = alerts.value.findIndex(a => a.id === id);
    if (index > -1) {
      alerts.value.splice(index, 1);
    }
  };

  return {
    alerts,
    addAlert,
    removeAlert,
  };
}
