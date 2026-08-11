import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const fetchFeed = createAsyncThunk('feed/fetchFeed', getFeedApi);

const initialState: {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
} = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.loading = false;
      });
  }
});

// ===== ДОБАВЛЕННЫЕ СЕЛЕКТОРЫ =====
export const selectFeeds = (state: { feed: typeof initialState }) =>
  state.feed.orders;
export const selectTotal = (state: { feed: typeof initialState }) =>
  state.feed.total;
export const selectTotalToday = (state: { feed: typeof initialState }) =>
  state.feed.totalToday;
export const selectFeedIsLoading = (state: { feed: typeof initialState }) =>
  state.feed.loading;

export default feedSlice.reducer;
