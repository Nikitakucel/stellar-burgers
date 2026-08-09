import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';

interface OrderState {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null
};

// ДОБАВЛЕН ТРЕТИЙ ДЖЕНЕРИК: { rejectValue: string }
export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/create', async (ingredientsIdArray, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientsIdArray);
    return {
      ...response.order,
      ingredients: ingredientsIdArray
    } as TOrder;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка оформления заказа');
  }
});

// ДОБАВЛЕН ТРЕТИЙ ДЖЕНЕРИК: { rejectValue: string }
export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchByNumber', async (number, { rejectWithValue }) => {
  try {
    const order = await getOrderByNumberApi(number);
    return order;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Заказ не найден');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        // action.payload теперь точно строка или undefined, ставим fallback через ??
        state.error = action.payload ?? 'Ошибка оформления заказа';
      })
      // Обработка fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Заказ не найден';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
