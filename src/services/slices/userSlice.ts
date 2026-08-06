import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie'; // Добавили импорт кук

export const getUser = createAsyncThunk('user/getUser', getUserApi);
export const loginUser = createAsyncThunk('user/loginUser', loginUserApi);
export const registerUser = createAsyncThunk(
  'user/registerUser',
  registerUserApi
);
export const logoutUser = createAsyncThunk('user/logoutUser', logoutApi);
export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    // Сначала проверяем, есть ли токен в куках. Если нет — сразу завершаем проверку
    const token = getCookie('accessToken');
    if (!token) {
      return false;
    }
    try {
      await dispatch(getUser()).unwrap();
      return true;
    } catch {
      return false;
    }
  }
);

const initialState: {
  user: TUser | null;
  isAuth: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
} = {
  user: null,
  isAuth: false,
  isAuthChecked: false,
  isLoading: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getUser
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      // checkUserAuth
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true; // ОБЯЗАТЕЛЬНО ставим true, чтобы снять прелоадер
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.isAuthChecked = true; // ОБЯЗАТЕЛЬНО ставим true, чтобы снять прелоадер
      })
      // loginUser (логин)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
        // СОХРАНЯЕМ ТОКЕНЫ ПРИ ВХОДЕ
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuth = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      // registerUser (регистрация)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
        // СОХРАНЯЕМ ТОКЕНЫ ПРИ РЕГИСТРАЦИИ
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(registerUser.rejected, (state) => {
        state.isAuth = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      // logoutUser (выход)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.isAuthChecked = true;
        state.user = null;
        // УДАЛЯЕМ ТОКЕНЫ ПРИ ВЫХОДЕ
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      // updateUser (обновление профиля)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export default userSlice.reducer;
