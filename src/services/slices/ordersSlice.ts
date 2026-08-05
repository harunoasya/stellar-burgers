import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type OrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const orders = await getOrdersApi();

  return orders;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })

      .addCase(fetchOrders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка загрузки заказов';
      });
  }
});

export default ordersSlice.reducer;
