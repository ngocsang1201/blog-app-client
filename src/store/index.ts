import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import commentReducer from './slices/commentSlice';
import configReducer from './slices/configSlice';
import socketReducer from './slices/socketSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  comment: commentReducer,
  config: configReducer,
  socket: socketReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false });
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export * from './useGlobalStore';
export * from './useUserStore';
