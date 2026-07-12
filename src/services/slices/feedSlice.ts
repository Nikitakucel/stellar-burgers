// src/services/slices/feedSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

export interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnecting: (state) => {
      state.isConnected = false;
      state.error = null;
    },
    wsOpen: (state) => {
      state.isConnected = true;
    },
    wsClose: (state) => {
      state.isConnected = false;
    },
    wsError: (state, action) => {
      state.error = action.payload;
    },
    wsMessage: (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  }
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage } =
  feedSlice.actions;
export default feedSlice.reducer;
