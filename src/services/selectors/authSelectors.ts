import { RootState } from '../store';

export const getUser = (state: RootState) => state.auth.user;

export const getIsAuthChecked = (state: RootState) => state.auth.isAuthChecked;

export const getAuthLoading = (state: RootState) => state.auth.isLoading;

export const getAuthError = (state: RootState) => state.auth.error;
