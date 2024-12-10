import { createSlice } from '@reduxjs/toolkit';

// Интерфейс состояния
interface AuthState {
  isAuth: boolean;
  uid: string | null; // Добавляем uid в состояние
}

// Начальное состояние
const initialState: AuthState = {
  isAuth: localStorage.getItem('isAuthenticated') === "true",
  uid: localStorage.getItem('uid'), // Сохраняем uid, если он есть в локальном хранилище
};

// Создание slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { uid } = action.payload; // Принимаем uid из action
      state.isAuth = true;
      state.uid = uid; // Устанавливаем uid
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('uid', uid); // Сохраняем uid в локальное хранилище
    },
    logout: (state) => {
      state.isAuth = false;
      state.uid = null; // Сбрасываем uid
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('uid');
    },
  },
});

// Экспортируем действия и редьюсер
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
