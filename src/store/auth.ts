import { create } from 'zustand'

type AuthState = {
  token: string | null
  user: { email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  async login(email, _password) {
    // Mock auth: in real app call API and set returned token
    await new Promise(r => setTimeout(r, 400))
    const token = 'demo-token'
    set({ token, user: { email } })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ email }))
  },
  logout() {
    set({ token: null, user: null })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
}))

// Rehydrate on load
const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
if (token) {
  useAuthStore.setState({ token, user: user ? JSON.parse(user) : null })
}
