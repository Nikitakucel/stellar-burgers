// src/services/slices/profileOrdersSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

export interface ProfileOrdersState {
  orders: TOrder[];
  isConnected: boolean;
  error: string | null;
}

const initialState: ProfileOrdersState = {
  orders: [],
  isConnected: false,
  error: null
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
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
    }
  }
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage } =
  profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;
