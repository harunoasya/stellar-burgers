import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import ordersReducer from './slices/ordersSlice';
import feedReduce from './slices/feedSlice';

const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  burgerConstructor: burgerConstructorReducer,
  auth: authReducer,
  order: orderReducer,
  orders: ordersReducer,
  feed: feedReduce
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
