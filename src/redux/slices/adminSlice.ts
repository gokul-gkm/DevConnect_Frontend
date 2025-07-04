import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminState {
    email: string | null;
}

const initialState: AdminState = {
    email: null,
};

 const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminCredentials: (state, action: PayloadAction<{ email: string}>) => {
        state.email = action.payload.email;
    },
    adminLogout: (state) => { 
        state.email = null;
    }
  },
});

export const { setAdminCredentials, adminLogout } = adminSlice.actions;

export default adminSlice.reducer;