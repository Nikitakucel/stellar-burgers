import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
      state.error = null;
    },
    wsClose: (state) => {
      state.isConnected = false;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.error = action.payload;
    },
    wsMessage: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
    },
    clearProfileOrders: (state) => {
      state.orders = [];
      state.isConnected = false;
      state.error = null;
    }
  }
});

export const {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  clearProfileOrders
} = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
