import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulation helpers (no backend) - in real app replace with API calls
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const sendOtp = createAsyncThunk('auth/sendOtp', async ({ recipient }, { rejectWithValue }) => {
  await delay(400);
  if (!recipient) return rejectWithValue('Recipient is required');
  // In a real app, backend sends OTP. Here we simulate success.
  return { recipient, message: `OTP sent to ${recipient}` };
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ recipient, code }, { rejectWithValue }) => {
  await delay(400);
  if (!recipient || !code) return rejectWithValue('Missing details');
  // For demo purposes the correct code is '1234'
  if (code !== '1234') return rejectWithValue('Invalid OTP code');
  return { recipient };
});

export const signup = createAsyncThunk('auth/signup', async ({ recipient, password }, { rejectWithValue }) => {
  await delay(600);
  if (!recipient || !password) return rejectWithValue('All fields are required');
  if (password.length < 6) return rejectWithValue('Password must be at least 6 characters');
  // Simulate created user
  return { user: { id: Date.now(), recipient }, token: 'fake-signup-token' };
});

export const login = createAsyncThunk('auth/login', async ({ recipient, password }, { rejectWithValue }) => {
  await delay(600);
  if (!recipient || !password) return rejectWithValue('All fields are required');
  // Demo: password must be 'password' to succeed
  if (password !== 'password') return rejectWithValue('Invalid credentials');
  return { user: { id: Date.now(), recipient }, token: 'fake-login-token' };
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ recipient, newPassword }, { rejectWithValue }) => {
  await delay(500);
  if (!recipient || !newPassword) return rejectWithValue('Missing details');
  if (newPassword.length < 6) return rejectWithValue('Password must be at least 6 characters');
  return { recipient };
});

export const loginWithOtp = createAsyncThunk('auth/loginWithOtp', async ({ recipient }, { rejectWithValue }) => {
  await delay(500);
  if (!recipient) return rejectWithValue('Missing recipient');
  // In a real application, backend would validate OTP session.
  return { user: { id: Date.now(), recipient }, token: 'fake-otp-login-token' };
});

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  otpMessage: null,
  otpRecipient: null,
  isOtpVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isOtpVerified = false;
      state.otpMessage = null;
      state.otpRecipient = null;
      try {
        localStorage.removeItem('easygo_auth_state');
      } catch (e) {
        // ignore
      }
    },
    clearError(state) {
      state.error = null;
    },
    clearOtp(state) {
      state.otpMessage = null;
      state.otpRecipient = null;
      state.isOtpVerified = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // sendOtp
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpMessage = action.payload.message;
        state.otpRecipient = action.payload.recipient;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // verifyOtp
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isOtpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // loginWithOtp
      .addCase(loginWithOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isOtpVerified = false;
        state.otpRecipient = null;
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.isOtpVerified = false;
        state.otpRecipient = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout, clearError, clearOtp } = authSlice.actions;
export default authSlice.reducer;
