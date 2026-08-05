export interface User {
  id: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}
