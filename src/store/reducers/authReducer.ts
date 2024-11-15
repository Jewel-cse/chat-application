import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: any;
}

const initialState: AuthState = {
  token: null,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    removeToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    }
  }
});

// Export actions and reducer
export const { setToken, removeToken } = authReducer.actions;
export default authReducer.reducer;
