import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';

// Simple localStorage persistence
const PERSIST_KEY = 'easygo_auth_state';

const loadState = () => {
  try {
    const serialized = localStorage.getItem(PERSIST_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    console.warn('Failed to load state from localStorage', err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const toSave = {
      auth: {
        user: state.auth.user || null,
        token: state.auth.token || null,
      },
    };
    localStorage.setItem(PERSIST_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn('Failed to save state to localStorage', err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
