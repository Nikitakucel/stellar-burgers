import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
import { TUser } from '../../utils/types';

export interface UserState {
  user: TUser | null;
  isAuth: boolean;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuth: false,
  isAuthChecked: false,
  loading: false,
  error: null
};

// Мок-проверка авторизации (сервер недоступен)
export const checkUserAuth = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('user/checkAuth', async (_, { rejectWithValue }) => {
  try {
    // Пока сервер не работает, просто считаем пользователя неавторизованным
    // Если нужно захардкодить пользователя, можно вернуть объект TUser
    // Но лучше оставить так, чтобы можно было тестировать вход
    return rejectWithValue('Не авторизован');
  } catch {
    return rejectWithValue('Не авторизован');
  }
});

// Остальные экшены (login, register, logout, update) можно оставить как есть,
// они не вызываются на главной странице, но если сервер не работает, то при попытке
// залогиниться тоже упадут. Для теста можно их тоже замокать, но позже.

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  } catch {
    return rejectWithValue('Ошибка входа');
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  } catch {
    return rejectWithValue('Ошибка регистрации');
  }
});

export const logoutUser = createAsyncThunk<null, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch {
      return rejectWithValue('Ошибка выхода');
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch {
    return rejectWithValue('Ошибка обновления профиля');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.loading = false;
        state.isAuth = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export default userSlice.reducer;
