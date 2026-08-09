import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';

const BURGER_API_URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${BURGER_API_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) return Promise.reject(refreshData);
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{ data: TIngredient[] }>;
export const getIngredientsApi = () =>
  fetch(`${BURGER_API_URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

export type TLoginData = { email: string; password: string };
export type TRegisterData = { email: string; name: string; password: string };
type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const loginUserApi = (data: TLoginData) =>
  fetch(`${BURGER_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${BURGER_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const logoutApi = () =>
  fetch(`${BURGER_API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));

type TUserResponse = TServerResponse<{ user: TUser }>;
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${BURGER_API_URL}/auth/user`, {
    headers: { authorization: getCookie('accessToken') as string }
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${BURGER_API_URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') as string
    },
    body: JSON.stringify(user)
  });

type TNewOrder = {
  _id: string;
  status: string;
  name: string;
  owner: TUser;
  createdAt: string;
  updatedAt: string;
  number: number;
};
type TNewOrderResponse = TServerResponse<{ order: TNewOrder; name: string }>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${BURGER_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') as string
    },
    body: JSON.stringify({ ingredients: data })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${BURGER_API_URL}/password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${BURGER_API_URL}/password-reset/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// ДЛЯ ЛЕНТЫ И ИСТОРИИ
type TFeedResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;
export const getFeedApi = () =>
  fetch(`${BURGER_API_URL}/orders/all`)
    .then((res) => checkResponse<TFeedResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const getOrdersApi = () =>
  fetchWithRefresh<TServerResponse<{ orders: TOrder[] }>>(
    `${BURGER_API_URL}/orders`,
    {
      headers: { authorization: getCookie('accessToken') as string }
    }
  ).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

// ИСПРАВЛЕННАЯ ФУНКЦИЯ: убраны {} и return
export const getOrderByNumberApi = (number: number) =>
  fetch(`${BURGER_API_URL}/orders/${number}`)
    .then((res) => checkResponse<TServerResponse<{ orders: TOrder[] }>>(res))
    .then((data) => {
      if (data?.success) return data.orders[0];
      return Promise.reject(data);
    });
