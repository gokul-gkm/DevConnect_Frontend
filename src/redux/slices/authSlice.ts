import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    username: string | null;
    email: string | null;
    role: string | null;
    isAuthenticated: boolean;
  _id: string | null;
  token: string | null;
}

const initialState: UserState = {
    username: null,
    email: null,
    role: null,
    isAuthenticated: false,
    _id: null,
    token: null
};

 const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{username: string, email: string, role?: string, _id: string, token: string}>) => {
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.role = action.payload?.role || null;
        state.isAuthenticated = true;
        state._id = action.payload._id;
        state.token = action.payload.token
    },
    logout: (state) => {
        state.username = null;
        state.email = null;
        state.role = null;
        state.isAuthenticated = false;
        state._id = null;
        state.token = null;
        localStorage.removeItem("access-token");
        localStorage.removeItem("user-role")
    }
  },
});

export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;