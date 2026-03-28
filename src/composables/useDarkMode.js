import { computed, ref, watch } from 'vue';

const isDark = ref(false);

// Load theme from localStorage on init
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme_mode');
  if (stored) {
    isDark.value = stored === 'dark';
  } else {
    // Check system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme();
}

// Watch for changes and update localStorage + DOM
watch(isDark, () => {
  localStorage.setItem('theme_mode', isDark.value ? 'dark' : 'light');
  applyTheme();
});

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleDarkMode() {
  isDark.value = !isDark.value;
}

export function useDarkMode() {
  return {
    isDark: computed(() => isDark.value),
    toggleDarkMode,
  };
}
