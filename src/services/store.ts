// src/services/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/burgerConstructorSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

import feedReducer, {
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  wsConnecting
} from './slices/feedSlice';
import profileOrdersReducer, {
  wsOpen as profileWsOpen,
  wsClose as profileWsClose,
  wsError as profileWsError,
  wsMessage as profileWsMessage,
  wsConnecting as profileWsConnecting
} from './slices/profileOrdersSlice';

import { socketMiddleware } from './socketMiddleware';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
});

const feedActions = {
  wsConnect: 'feed/connect',
  wsDisconnect: 'feed/disconnect',
  wsConnecting: wsConnecting.type,
  onOpen: wsOpen.type,
  onClose: wsClose.type,
  onError: wsError.type,
  onMessage: wsMessage.type
};

const profileActions = {
  wsConnect: 'profileOrders/connect',
  wsDisconnect: 'profileOrders/disconnect',
  wsConnecting: profileWsConnecting.type,
  onOpen: profileWsOpen.type,
  onClose: profileWsClose.type,
  onError: profileWsError.type,
  onMessage: profileWsMessage.type
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      socketMiddleware(feedActions),
      socketMiddleware(profileActions)
    ),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
