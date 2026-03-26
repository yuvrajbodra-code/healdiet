import create from 'zustand'

export const useHealthStore = create((set) => ({
  healthProfile: null,
  loading: false,
  error: null,
  
  setHealthProfile: (profile) => set({ healthProfile: profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}))
