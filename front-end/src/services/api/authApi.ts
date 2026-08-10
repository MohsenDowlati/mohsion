import { AuthResponse} from "@/types/auth"

type AuthPayload = {
  name: string
  password: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api"

async function requestAuth(
  endpoint: string,
  payload: AuthPayload
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  const data = await response.json().catch(() => null) as
    | AuthResponse
    | { message?: string }
    | null

  if (!response.ok) {
    throw new Error("Authentication request failed")
  }

  return data as AuthResponse
}

const authApi = {
  async me(token: string) {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error("Session expired")
    return data as import("@/types/auth").User
  },

  signUp(name: string, password: string) {
    return requestAuth("register", { name, password })
  },

  signIn(name: string, password: string) {
    return requestAuth("login", { name, password })
  }
}

export default authApi
