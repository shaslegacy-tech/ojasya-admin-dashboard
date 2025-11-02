import { create } from 'zustand';

type ThemeState = {
  dark: boolean;
  toggleDark: () => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (b: boolean) => void;

  hoverExpanded: boolean;
  setHoverExpanded: (b: boolean) => void;
};



function setHtml(isDark: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
  }
}

function detectSystem(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  dark: false,
  toggleDark: () => {
    const next = !get().dark;
    set({ dark: next });
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setHtml(next);
  },

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (b: boolean) => set({ sidebarCollapsed: b }),

  hoverExpanded: false,
  setHoverExpanded: (b: boolean) => set({ hoverExpanded: b }),
}));

// init from saved or system
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('theme');
  const isDark = saved ? saved === 'dark' : detectSystem();
  useThemeStore.setState({ dark: isDark });
  setHtml(isDark);
}