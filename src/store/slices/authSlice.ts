import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      // Save to localStorage
      localStorage.setItem("auth", JSON.stringify({ token: state.token, user: state.user }));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("auth");
    },
    // Optionally, a rehydrate action
    rehydrate: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    }
  },
});

export const { setCredentials, logout, rehydrate } = authSlice.actions;
export default authSlice.reducer;