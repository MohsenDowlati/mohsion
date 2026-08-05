import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AuthState, User } from "@/types/auth"


const initialState: AuthState = {
  user: null,
  token: null,
  loading: false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },

    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
    },

    logout(state) {
      state.user = null
      state.token = null
    }
  }
})

export const { setUser, setToken, logout } = authSlice.actions
export default authSlice.reducer
