import { RootState } from '../store';

export const getOrderNumber = (state: RootState) => state.order.orderNumber;

export const getOrderLoading = (state: RootState) => state.order.isLoading;

export const getOrderError = (state: RootState) => state.order.error;
