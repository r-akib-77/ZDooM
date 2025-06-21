import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem('zdoom-theme') || 'dim',
    setTheme: (theme) => {
        localStorage.setItem('zdoom-theme', theme)
        set({ theme })
    }
}))