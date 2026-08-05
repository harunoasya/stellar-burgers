import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

type AuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async () => {
    const data = await getUserApi();
    return data.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string; password: string }) => {
    const response = await loginUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);

    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: { email: string; password: string; name: string }) => {
    const response = await registerUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);

    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string) => {
    await forgotPasswordApi({ email });
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();

  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { name?: string; email?: string; password?: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })

      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.isLoading = false;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })

      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка авторизации';
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })

      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка регистрации';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })

      .addCase(forgotPassword.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка восстановления пароля';
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })

      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка смены пароля';
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })

      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка обновления данных';
      });
  }
});

export default authSlice.reducer;
