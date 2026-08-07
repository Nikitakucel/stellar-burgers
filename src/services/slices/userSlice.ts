import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

export const getUser = createAsyncThunk('user/getUser', getUserApi);

// Логин — сохраняем токены прямо в thunk
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res;
  }
);

// Регистрация — сохраняем токены прямо в thunk
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res;
  }
);

// Выход — удаляем токены прямо в thunk
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const res = await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return res;
});

export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
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
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.isAuthChecked = true;
      })
      // loginUser
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
        // Токены уже сохранены в thunk, здесь только стейт!
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuth = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      // registerUser
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
        // Токены уже сохранены в thunk!
      })
      .addCase(registerUser.rejected, (state) => {
        state.isAuth = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.isAuthChecked = true;
        state.user = null;
        // Токены уже удалены в thunk!
      })
      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export default userSlice.reducer;
