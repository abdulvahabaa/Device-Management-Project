import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  engineer: null,
  token: null,
  devices: [],

};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.engineer = action.payload.engineer;
      state.token = action.payload.token;
    },
    setEngineer: (state, action) => {
      state.engineer = action.payload.engineer;
    },
    setLogout: (state) => {
      state.engineer = null;
      state.token = null;
    },
   
  },
});

export const {
  setMode,
  setLogin,
  setEngineer,
  setLogout,
 
 
} = authSlice.actions;

export default authSlice.reducer;