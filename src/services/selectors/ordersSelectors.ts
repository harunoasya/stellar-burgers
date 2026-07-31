import { RootState } from '../store';

export const getOrders = (state: RootState) => state.orders.orders;

export const getOrdersLoading = (state: RootState) => state.orders.isLoading;
