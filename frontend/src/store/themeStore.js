import create from 'zustand'

export const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  
  toggleTheme: () => set((state) => {
    const newDark = !state.isDark
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    return { isDark: newDark }
  })
}))
