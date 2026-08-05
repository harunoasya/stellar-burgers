import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { setFeed } = feedSlice.actions;

export default feedSlice.reducer;
