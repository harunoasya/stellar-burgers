import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type OrderState = {
  orderNumber: number | null;
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orderNumber: null,
  order: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);

    return response.order.number;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,

  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload;
      })

      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка создания заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })

      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
