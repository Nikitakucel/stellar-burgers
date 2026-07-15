// src/services/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export interface UserState {
  user: { email: string; name: string } | null;
  isAuth: boolean;
  isAuthChecked: boolean; // <-- Добавили
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuth: false,
  isAuthChecked: false, // <-- Добавили сюда
  loading: false,
  error: null
};

// 1. Авторизация (логин)
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка входа');
    }
  }
);

// 2. Регистрация
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

// 3. Выход
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (err) {
      return rejectWithValue('Ошибка выхода');
    }
  }
);

// 4. Проверка авторизации (загрузка пользователя при перезагрузке страницы)
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (err) {
      return rejectWithValue('Не авторизован');
    }
  }
);

// 5. Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка обновления профиля');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Логин
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
      })
      // Проверка авторизации (именно сюда вы просили вставить)
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.isAuthChecked = true; // <-- Отмечаем, что проверка завершена
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.loading = false;
        state.isAuth = false;
        state.isAuthChecked = true; // <-- Отмечаем, что проверка завершена (даже с ошибкой)
        state.user = null;
      })
      // Обновление профиля
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export default userSlice.reducer;
