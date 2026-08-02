import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

export const getUser = createAsyncThunk('user/getUser', getUserApi);
export const loginUser = createAsyncThunk('user/loginUser', loginUserApi);
export const registerUser = createAsyncThunk(
  'user/registerUser',
  registerUserApi
);
export const logoutUser = createAsyncThunk('user/logoutUser', logoutApi);
export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);

// Экшен для проверки авторизации, который используется в app.tsx
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      await dispatch(getUser()).unwrap();
      return true;
    } catch {
      return false;
    }
  }
);

// Добавляем оба поля: isAuth (для конструктора) и isAuthChecked (для защищенных роутов)
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
      // getUser (получение данных юзера)
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.isAuthChecked = true; // Помечаем, что проверка прошла
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.isAuthChecked = true; // Помечаем, что проверка завершилась (даже если с ошибкой)
        state.user = null;
      })
      // checkUserAuth
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.isAuthChecked = true;
      })
      // loginUser (логин)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuth = false;
        state.isAuthChecked = true; // Нужно обязательно ставить true, иначе бесконечный прелоадер!
        state.user = null;
      })
      // registerUser (регистрация)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
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
      })
      // updateUser (обновление профиля)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export default userSlice.reducer;
