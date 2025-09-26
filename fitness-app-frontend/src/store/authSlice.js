
import { createSlice } from "@reduxjs/toolkit";


const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
    const expiry = payload.exp * 1000; 
    return Date.now() < expiry;
  } catch (e) {
    return false; // if decoding fails, token is invalid
  }
};

//  Restore state only if valid token exists
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState = isTokenValid(storedToken)
  ? {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken,
      userId: localStorage.getItem("userId"),
    }
  : {
      user: null,
      token: null,
      userId: null,
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userId = action.payload.userId;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("userId", action.payload.user.sub);
      } else {
        state.user = null;
        state.token = null;
        state.userId = null;

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
