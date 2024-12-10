import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuth: boolean;
  uid: string | null; 
}

const initialState: AuthState = {
  isAuth: localStorage.getItem('isAuthenticated') === "true",
  uid: localStorage.getItem('uid'), 
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { uid } = action.payload; 
      state.isAuth = true;
      state.uid = uid;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('uid', uid);
    },
    logout: (state) => {
      state.isAuth = false;
      state.uid = null; 
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('uid');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
