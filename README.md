# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Auth (Redux) — Quick Guide ✅

I added Redux-based authentication flows (OTP, signup, login, reset password) using `@reduxjs/toolkit` and `react-redux`.

How to run the app

1. Start dev server:
   ```bash
   npm run dev
   ```
2. Open the app at `http://localhost:5173`

Manual test checklist

- Signup (email):
  - Go to `SIGN UP` → Email tab
  - Use `test@example.com` and password `password` (>=6 chars) to succeed
- Login (email/password):
  - `LOG IN` → Email tab
  - Use `test@example.com` + `password` to log in
- Login with OTP (mobile):
  - `LOG IN` → Mobile tab
  - Enter country code (e.g., `+91`) and a 10-digit number (e.g., `1234567890`)
  - Click `LOG IN` (without entering password) to send OTP
  - Enter OTP `1234` on OTP screen (this is the demo valid code)
- Forgot password:
  - In `LOG IN` view click `Forgot Password?`
  - Enter email or mobile and click `Get Otp`
  - Enter OTP `1234`, then set a new password (>=6 chars)

Notes

- All API calls are simulated locally in `src/features/auth/authSlice.js` for demo purposes.
- Redux state is persisted to localStorage under key `easygo_auth_state` (so login survives refresh).
- If you see a `manpath: can't set the locale` message when running `npm run dev`, it's harmless — Vite still serves the app.

Running E2E tests (Playwright)

I added Playwright tests that exercise signup/login/OTP/forgot-password flows. To run them locally (the host machine must allow installing Playwright browsers):

1. Install dev deps and Playwright browsers:
   ```bash
   npm install
   npx playwright install
   ```
2. Run the tests:
   ```bash
   npm run test:e2e
   ```

Note: I couldn't fully install Playwright browsers on this environment due to missing OS packages (apt errors). I added the `tests/auth.spec.js` and `playwright.config.js` so you can run the tests locally. If you'd like, I can help diagnose Playwright install errors or provide a Docker-based test environment.

If you'd like, I can now run through the UI flows in the browser and fix any styling/UX issues you find — say "Test UI" and I'll continue.