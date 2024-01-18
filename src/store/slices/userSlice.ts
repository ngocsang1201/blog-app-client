import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, userApi } from '~/api';
import { localStorageKey } from '~/constants';
import {
  AuthPayload,
  GoogleAuthPayload,
  LoginFormValues,
  RegisterFormValues,
  User,
  UserConfig,
  UserConfigKey,
} from '~/models';
import { RootState } from '~/store';
import { showToast } from '~/utils/toast';

export const login = createAsyncThunk(
  'user/login',
  async (payload: AuthPayload<LoginFormValues>, { rejectWithValue }) => {
    try {
      const { formValues, navigate } = payload;
      const { user, token } = await authApi.login(formValues);
      localStorage.setItem(localStorageKey.ACCESS_TOKEN, token);
      navigate?.('/', { replace: true });
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'user/googleLogin',
  async (payload: GoogleAuthPayload, { rejectWithValue }) => {
    try {
      const { token, navigate } = payload;
      const { user, activeToken } = await authApi.googleLogin(token);

      if (activeToken) {
        navigate?.(`/create-password?token=${activeToken}`);
        return null;
      }

      localStorage.setItem(localStorageKey.ACCESS_TOKEN, token);
      navigate?.('/', { replace: true });
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (payload: AuthPayload<RegisterFormValues>, { rejectWithValue }) => {
    try {
      const { formValues, navigate } = payload;
      await authApi.register(formValues);
      navigate?.('/login', { replace: true });
      showToast('checkEmail', 'info');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCurrentUserAsync = createAsyncThunk(
  'user/updateCurrentUserAsync',
  async (user: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await userApi.updateCurrentUser(user);
      showToast('user.update');
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

interface UserState {
  submitting: boolean;
  currentUser: User | null;
  config: UserConfig;
}

const localConfig = JSON.parse(localStorage.getItem(localStorageKey.USER_CONFIG) || '{}');

const initialState: UserState = {
  submitting: false,
  currentUser: null,
  config: {
    theme: 'light',
    mainColor: '#FF652F',
    language: 'en',
    ...localConfig,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },

    updateCurrentUser(state, action: PayloadAction<Partial<User>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },

    setSubmitting(state, action: PayloadAction<boolean>) {
      state.submitting = action.payload;
    },

    updateConfig(state, action: PayloadAction<{ name: UserConfigKey; value: any }>) {
      const { name, value } = action.payload;
      state.config[name] = value;
      localStorage.setItem(localStorageKey.USER_CONFIG, JSON.stringify(state.config));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.submitting = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.submitting = false;
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.submitting = false;
      });

    builder
      .addCase(googleLogin.pending, (state) => {
        state.submitting = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.submitting = false;
        state.currentUser = action.payload;
      })
      .addCase(googleLogin.rejected, (state) => {
        state.submitting = false;
      });

    builder
      .addCase(register.pending, (state) => {
        state.submitting = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(register.rejected, (state) => {
        state.submitting = false;
      });

    builder
      .addCase(updateCurrentUserAsync.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateCurrentUserAsync.fulfilled, (state, action) => {
        state.submitting = false;
        state.currentUser = { ...state.currentUser, ...action.payload };
      })
      .addCase(updateCurrentUserAsync.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const userActions = userSlice.actions;

export const selectAuthSubmitting = (state: RootState) => state.user.submitting;
export const selectUserConfig = (state: RootState) => state.user.config;

const userReducer = userSlice.reducer;
export default userReducer;
