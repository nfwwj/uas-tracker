import { create } from 'zustand'
import type { CurrentUser } from '@/types/auth'


export interface AuthState{
    user: CurrentUser | null
    checked: boolean
    setUser: (user:CurrentUser | null) => void
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  checked: false,
  setUser: (user) => set({ user: user, checked: true }),
}))

//checked -> on start up, fetch /auth/me, once. after that, log in state determined by user.
