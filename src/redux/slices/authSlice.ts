import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    username: string | null;
    email: string | null;
    role: string | null;
    isAuthenticated: boolean;
    _id: string | null
}

const initialState: UserState = {
    username: null,
    email: null,
    role: null,
    isAuthenticated: false,
    _id: null
};

 const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{username: string, email: string, role?: string, _id: string}>) => {
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.role = action.payload?.role || null;
        state.isAuthenticated = true;
        state._id = action.payload._id
    },
    logout: (state) => {
        state.username = null;
        state.email = null;
        state.role = null;
        state.isAuthenticated = false;
        state._id = null
        localStorage.removeItem("access-token");
    }
  },
});

export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;