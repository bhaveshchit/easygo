import store from '../src/store/index.js';
import { sendOtp, verifyOtp, loginWithOtp, signup, login, resetPassword } from '../src/features/auth/authSlice.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  console.log('Initial auth state:', store.getState().auth);

  // Test sendOtp
  console.log('\nSending OTP to +911234567890...');
  try {
    const res = await store.dispatch(sendOtp({ recipient: '+911234567890' })).unwrap();
    console.log('sendOtp result:', res);
  } catch (err) {
    console.error('sendOtp error:', err);
  }

  // Test verifyOtp with wrong code
  try {
    await store.dispatch(verifyOtp({ recipient: '+911234567890', code: '0000' })).unwrap();
    console.error('verifyOtp should have failed for wrong code');
  } catch (err) {
    console.log('verifyOtp rejected as expected:', err);
  }

  // Verify with correct code
  try {
    const res = await store.dispatch(verifyOtp({ recipient: '+911234567890', code: '1234' })).unwrap();
    console.log('verifyOtp success:', res);
  } catch (err) {
    console.error('verifyOtp unexpected error:', err);
  }

  // Test loginWithOtp
  try {
    const res = await store.dispatch(loginWithOtp({ recipient: '+911234567890' })).unwrap();
    console.log('loginWithOtp success:', res);
  } catch (err) {
    console.error('loginWithOtp error:', err);
  }

  // Test signup with short password
  try {
    await store.dispatch(signup({ recipient: 'test@example.com', password: '123' })).unwrap();
    console.error('signup should have failed for short password');
  } catch (err) {
    console.log('signup rejected as expected:', err);
  }

  // Test signup success
  try {
    const res = await store.dispatch(signup({ recipient: 'test@example.com', password: 'password' })).unwrap();
    console.log('signup success:', res);
  } catch (err) {
    console.error('signup unexpected error:', err);
  }

  // Test login wrong password
  try {
    await store.dispatch(login({ recipient: 'test@example.com', password: 'wrong' })).unwrap();
    console.error('login should have failed for wrong password');
  } catch (err) {
    console.log('login rejected as expected:', err);
  }

  // Test login correct
  try {
    const res = await store.dispatch(login({ recipient: 'test@example.com', password: 'password' })).unwrap();
    console.log('login success:', res);
  } catch (err) {
    console.error('login unexpected error:', err);
  }

  // Test resetPassword failing
  try {
    await store.dispatch(resetPassword({ recipient: 'test@example.com', newPassword: '123' })).unwrap();
    console.error('resetPassword should have failed for short password');
  } catch (err) {
    console.log('resetPassword rejected as expected:', err);
  }

  // Test resetPassword success
  try {
    const res = await store.dispatch(resetPassword({ recipient: 'test@example.com', newPassword: 'newpassword' })).unwrap();
    console.log('resetPassword success:', res);
  } catch (err) {
    console.error('resetPassword unexpected error:', err);
  }

  console.log('\nFinal auth state:', store.getState().auth);
}

run().catch((e) => console.error('Test script error:', e));
