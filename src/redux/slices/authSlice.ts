import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    username: string | null;
    email: string | null;
    role: string | null;
    isAuthenticated: boolean ;
}

const initialState: UserState = {
    username: null,
    email: null,
    role: null,
    isAuthenticated: false,
};

 const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{username: string, email: string, role?: string}>) => {
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.role = action.payload?.role || null;
        state.isAuthenticated = true;
    },
    logout: (state) => {
        state.username = null;
        state.email = null;
        state.role = null;
        state.isAuthenticated = false;
        localStorage.removeItem("access-token");
    }
  },
});

export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;