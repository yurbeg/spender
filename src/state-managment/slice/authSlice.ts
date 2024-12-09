import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuth: boolean;

}

const initialState: AuthState = {
  isAuth: localStorage.getItem('isAuthenticated') === "true",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isAuth = true;
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout: (state) => {
      state.isAuth = false;
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('uid');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
