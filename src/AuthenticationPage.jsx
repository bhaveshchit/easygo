import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaGoogle, FaApple, FaFacebook, FaTwitter, FaEye, FaEyeSlash, FaMobileAlt, FaEnvelope } from 'react-icons/fa';
import './App.css'; // Assuming some shared styling
import SuccessCard from './components/SuccessCard';
import { sendOtp, verifyOtp, loginWithOtp, signup, login, resetPassword, clearError, clearOtp } from './features/auth/authSlice';

function AuthenticationPage() {
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false); // New state for signup form visibility
  const [showOtpCard, setShowOtpCard] = useState(false); // New state for OTP card visibility
  const [showForgotPasswordCard, setShowForgotPasswordCard] = useState(false); // New state for Forgot Password card visibility
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'mobile'
  const [showMobilePasswordField, setShowMobilePasswordField] = useState(false); // State for password field visibility ONLY in mobile tab
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [mobileNumber, setMobileNumber] = useState(''); // State for mobile number input
  const [countryCode, setCountryCode] = useState('+91'); // State for country code input
  const [emailAddress, setEmailAddress] = useState(''); // State for email address input
  const [otpRecipient, setOtpRecipient] = useState(''); // State to store the recipient for OTP
  const [otpPurpose, setOtpPurpose] = useState(''); // State to store the purpose of the OTP (e.g., 'login', 'reset_password')
  const [signupPassword, setSignupPassword] = useState(''); // State for signup password
  const [signupConfirmPassword, setSignupConfirmPassword] = useState(''); // State for signup confirm password
  const [passwordMismatchError, setPasswordMismatchError] = useState(false); // State for password mismatch error
  const [loginPassword, setLoginPassword] = useState(''); // Local password for login (email or mobile)
  const [otpValues, setOtpValues] = useState(['', '', '', '']); // Controlled OTP inputs
  const [pendingSignup, setPendingSignup] = useState(null); // Holds { recipient, password } while waiting for OTP
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth); // Auth state from Redux
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState(''); // State for email validation error
  const [mobileError, setMobileError] = useState(''); // State for mobile number validation error
  const [signupFormError, setSignupFormError] = useState(''); // State for general signup form error
  const [showResetPasswordCard, setShowResetPasswordCard] = useState(false); // New state for Reset Password card visibility
  const [newPassword, setNewPassword] = useState(''); // State for new password input
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // State for confirm new password input
  const [resetPasswordError, setResetPasswordError] = useState(''); // State for reset password validation error

  // Success card state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const successTimerRef = useRef(null);








  // Validation functions
  const validateEmail = (email) => {
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  // Helper to show success card and optionally redirect after short delay
  const triggerSuccessDisplay = (message, redirectTo) => {
    // clear existing timer
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
    setSuccessMessage(message);
    setShowSuccess(true);

    // auto-dismiss and redirect after 2s if redirectTo supplied
    if (redirectTo) {
      successTimerRef.current = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
        try { navigate(redirectTo); } catch (e) { try { window.location.href = redirectTo; } catch (err) {} }
        successTimerRef.current = null;
      }, 2000);
    }
  };

  const closeSuccess = () => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
    setShowSuccess(false);
    setSuccessMessage('');
  };

  const validateMobile = (mobile) => {
    // Basic 10-digit mobile number validation
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return 'Please enter a valid 10-digit mobile number.';
    }
    return '';
  };

  const handleLoginClick = () => {
    setShowLoginCard(true);
    setShowSignupForm(false); // Hide signup form if login is clicked
    setShowOtpCard(false); // Hide OTP card if login is clicked
    setShowForgotPasswordCard(false); // Hide Forgot Password card if login is clicked
    setActiveTab('email'); // Reset tab
    setShowMobilePasswordField(false); // Reset password field visibility
    setShowPassword(false); // Reset password visibility
    setMobileNumber(''); // Clear mobile number
    setEmailAddress(''); // Clear email address
    setOtpRecipient(''); // Clear OTP recipient
    setSignupPassword(''); // Clear signup password
    setSignupConfirmPassword(''); // Clear signup confirm password
    setPasswordMismatchError(false); // Clear password mismatch error
    setEmailError(''); // Clear email error
    setMobileError(''); // Clear mobile error
    setSignupFormError(''); // Clear signup form error
  };

  const handleSignUpClick = () => {
    setShowSignupForm(true);
    setShowLoginCard(false); // Hide login card if signup is clicked
    setShowOtpCard(false); // Hide OTP card if signup is clicked
    setShowForgotPasswordCard(false); // Hide Forgot Password card if signup is clicked
    setActiveTab('email'); // Reset tab
    setShowMobilePasswordField(false); // Reset password field visibility
    setShowPassword(false); // Reset password visibility
    setMobileNumber(''); // Clear mobile number
    setEmailAddress(''); // Clear email address
    setOtpRecipient(''); // Clear OTP recipient
    setSignupPassword(''); // Clear signup password
    setSignupConfirmPassword(''); // Clear signup confirm password
    setPasswordMismatchError(false); // Clear password mismatch error
    setEmailError(''); // Clear email error
    setMobileError(''); // Clear mobile error
    setSignupFormError(''); // Clear signup form error
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowMobilePasswordField(false); // Reset password field visibility when switching tabs
    setShowPassword(false); // Reset password visibility when switching tabs
    setMobileNumber(''); // Clear mobile number
    setEmailAddress(''); // Clear email address
    setSignupPassword(''); // Clear signup password
    setSignupConfirmPassword(''); // Clear signup confirm password
    setPasswordMismatchError(false); // Clear password mismatch error
    setEmailError(''); // Clear email error
    setMobileError(''); // Clear mobile error
    setSignupFormError(''); // Clear signup form error
  };

  const handleLoginUsingPasswordClick = () => {
    setShowMobilePasswordField(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleOtpVerification = () => {
    const code = otpValues.join('');
    const recipient = auth.otpRecipient || otpRecipient;
    dispatch(verifyOtp({ recipient, code }))
      .unwrap()
      .then(() => {
        // If login via OTP, complete login
        if (otpPurpose === 'login') {
          dispatch(loginWithOtp({ recipient }))
            .unwrap()
            .then(() => {
              dispatch(clearOtp());
              triggerSuccessDisplay('Logged in successfully', '/');
            })
            .catch((err) => setSignupFormError(err || 'Login failed'));
        } else if (otpPurpose === 'reset_password') {
          setShowOtpCard(false);
          setShowResetPasswordCard(true);
        } else if (otpPurpose === 'signup') {
          // Complete signup after OTP verified
          if (!pendingSignup) {
            setSignupFormError('Missing signup data. Please try again.');
          } else {
            dispatch(signup({ recipient: pendingSignup.recipient, password: pendingSignup.password }))
              .unwrap()
              .then(() => {
                setPendingSignup(null);
                dispatch(clearOtp());
                // Prepare login card and navigate user immediately to login screen
                setShowLoginCard(true);
                navigate('/auth');
              })
              .catch((err) => setSignupFormError(err || 'Signup failed'));
          }
        }
        setOtpValues(['', '', '', '']);
        setOtpPurpose(''); // Clear otpPurpose after use
      })
      .catch((err) => {
        setSignupFormError(err || 'Invalid OTP');
      });
  };

  const handleLoginSubmit = () => {
    // Validate inputs before submission
    let currentEmailError = '';
    let currentMobileError = '';

    if (activeTab === 'email') {
      currentEmailError = validateEmail(emailAddress);
      setEmailError(currentEmailError);
    } else {
      currentMobileError = validateMobile(mobileNumber);
      setMobileError(currentMobileError);
    }

    if (currentEmailError || currentMobileError) {
      return; // Prevent submission if there are errors
    }

    if (activeTab === 'mobile') {
      if (!showMobilePasswordField) {
        // User is trying to login with just mobile number, implies OTP
        const recipient = countryCode + mobileNumber;
        setOtpRecipient(recipient); // Keep local tracking for UI
        setOtpPurpose('login'); // Set OTP purpose to 'login'

        dispatch(sendOtp({ recipient }))
          .unwrap()
          .then(() => {
            setShowOtpCard(true);
            setShowLoginCard(false);
            setShowSignupForm(false);
            setShowForgotPasswordCard(false);
            setShowPassword(false);
          })
          .catch((err) => setSignupFormError(err || 'Failed to send OTP'));
      } else {
        // User is trying to login with mobile and password (use Redux login)
        const recipient = countryCode + mobileNumber;
        dispatch(login({ recipient, password: loginPassword }))
          .unwrap()
          .then(() => {
            navigate('/');
          })
          .catch((err) => setSignupFormError(err || 'Login failed'));
      }
    } else {
      // For email login, proceed with email/password login logic using Redux
      const recipient = emailAddress;
      dispatch(login({ recipient, password: loginPassword }))
        .unwrap()
        .then(() => {
          navigate('/');
        })
        .catch((err) => setSignupFormError(err || 'Login failed'));
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordCard(true);
    setShowLoginCard(false);
    setShowSignupForm(false);
    setShowOtpCard(false);
    setShowMobilePasswordField(false); // Reset password field visibility
    setShowPassword(false); // Reset password visibility
    setMobileNumber(''); // Clear mobile number
    setEmailAddress(''); // Clear email address
    setOtpRecipient(''); // Clear OTP recipient
    setSignupPassword(''); // Clear signup password
    setSignupConfirmPassword(''); // Clear signup confirm password
    setPasswordMismatchError(false); // Clear password mismatch error
    setEmailError(''); // Clear email error
    setMobileError(''); // Clear mobile error
    setSignupFormError(''); // Clear signup form error
    setShowResetPasswordCard(false); // Clear reset password card visibility
    setNewPassword(''); // Clear new password
    setConfirmNewPassword(''); // Clear confirm new password
    setResetPasswordError(''); // Clear reset password error
  };

  const handleGetOtpClick = () => {
    // Validate inputs before submission
    let currentEmailError = '';
    let currentMobileError = '';

    if (activeTab === 'email') {
      currentEmailError = validateEmail(emailAddress);
      setEmailError(currentEmailError);
    } else {
      currentMobileError = validateMobile(mobileNumber);
      setMobileError(currentMobileError);
    }

    if (currentEmailError || currentMobileError) {
      return; // Prevent submission if there are errors
    }

    const recipient = activeTab === 'mobile' ? countryCode + mobileNumber : emailAddress;
    dispatch(sendOtp({ recipient }))
      .unwrap()
      .then(() => {
        setOtpRecipient(recipient);
        setOtpPurpose('reset_password'); // Set OTP purpose to 'reset_password'
        setShowOtpCard(true);
      })
      .catch((err) => setSignupFormError(err || 'Failed to send OTP'));
    // setShowForgotPasswordCard(false); // Removed this line
  };

  const handleSignupSubmit = () => {
    // Clear previous form error
    setSignupFormError('');

    // Validate email/mobile
    let currentEmailError = '';
    let currentMobileError = '';
    let hasEmptyFields = false;

    if (activeTab === 'email') {
      currentEmailError = validateEmail(emailAddress);
      setEmailError(currentEmailError);
      if (!emailAddress) {
        hasEmptyFields = true;
      }
    } else {
      currentMobileError = validateMobile(mobileNumber);
      setMobileError(currentMobileError);
      if (!mobileNumber) {
        hasEmptyFields = true;
      }
    }

    // Validate passwords
    if (!signupPassword || !signupConfirmPassword) {
      hasEmptyFields = true;
    }

    if (hasEmptyFields) {
      setSignupFormError('Please fill in all required fields.');
      return; // Prevent submission
    }

    if (currentEmailError || currentMobileError) {
      return; // Prevent submission if there are errors
    }

    if (signupPassword !== signupConfirmPassword) {
      setPasswordMismatchError(true);
      return; // Prevent submission
    }
    setPasswordMismatchError(false); // Clear any previous error

    const recipient = activeTab === 'mobile' ? countryCode + mobileNumber : emailAddress;

    // Instead of directly signing up, send OTP and store pending signup data until OTP verification
    dispatch(sendOtp({ recipient }))
      .unwrap()
      .then(() => {
        setPendingSignup({ recipient, password: signupPassword });
        setOtpRecipient(recipient);
        setOtpPurpose('signup');
        setShowOtpCard(true);
        setShowSignupForm(false);
        setSignupPassword(''); // keep confirm cleared for security
        setSignupConfirmPassword('');
      })
      .catch((err) => setSignupFormError(err || 'Failed to send OTP'));
  };

  const handleResetPasswordSubmit = () => {
    if (newPassword !== confirmNewPassword) {
      setResetPasswordError('Passwords do not match!');
      return;
    }
    if (!newPassword || !confirmNewPassword) {
      setResetPasswordError('Please enter and confirm your new password.');
      return;
    }

    setResetPasswordError(''); // Clear any previous error
    const recipient = auth.otpRecipient || otpRecipient;

    dispatch(resetPassword({ recipient, newPassword }))
      .unwrap()
      .then(() => {
        setNewPassword('');
        setConfirmNewPassword('');
        dispatch(clearOtp());
        // Redirect to login after successful reset
        navigate('/auth');
      })
      .catch((err) => setResetPasswordError(err || 'Failed to reset password'));
  };

  return (
    <div className="authentication-page auth-background">
      <img src="/Vector.svg" className="vector-image" alt="Vector" />
      <div className="auth-wrapper">

        {!showLoginCard && !showSignupForm && !showOtpCard && !showForgotPasswordCard ? (
          <div className="auth-card">
            <h2>Let’s Get Started!</h2>
            <p className="subtitle">Let’s dive into your account</p>

            <div className="social-grid">
              <button className="social-btn google">
                <FaGoogle /><span className="social-btn-text">Continue with Google</span>
              </button>
              <button className="social-btn apple">
                <FaApple /><span className="social-btn-text">Continue with Apple</span>
              </button>
              <button className="social-btn facebook">
                <FaFacebook /><span className="social-btn-text">Continue with Facebook</span>
              </button>
              <button className="social-btn twitter">
                <FaTwitter /><span className="social-btn-text">Continue with Twitter</span>
              </button>
            </div>

            <button className="primary-btn" onClick={handleSignUpClick}>SIGN UP</button>
            <button className="secondary-btn" onClick={handleLoginClick}>LOG IN</button>

            <p className="terms">
              By proceeding further you agree to our
              <span>Terms & conditions</span> and
              <span>Privacy policy</span>
            </p>
          </div>
        ) : showLoginCard ? (
          <div className="login-card">
            <h2>Log In Using Number or email</h2>

            {/* Tabs */}
            <div className="login-tabs">
              <button className={`tab-btn ${activeTab === 'mobile' ? 'active' : ''}`} onClick={() => handleTabClick('mobile')}>Mobile</button>
              <button className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`} onClick={() => handleTabClick('email')}>Email</button>
            </div>

            {activeTab === 'email' && (
              <>
                {/* Email */}
                <div className="field">
                  <label>Email Address</label>
                  <div className="input-box">
                    <span className="icon"><FaEnvelope /></span>
                    <input type="email" placeholder="Email" value={emailAddress} onChange={(e) => { setEmailAddress(e.target.value); setEmailError(validateEmail(e.target.value)); }} />
                  </div>
                </div>
                {emailError && <p className="error-message">{emailError}</p>}
                {/* Password field always visible for email */}
                <div className="field">
                  <label>Password</label>
                  <div className="input-box">
                    <span className="icon"><FaEye /></span>
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    <span className="icon right" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <a className="forgot" onClick={handleForgotPasswordClick}>Forgot Password?</a>
                </div>
              </>
            )}

            {activeTab === 'mobile' && (
              <>
                {/* Mobile Number */}
                <div className="field">
                  <label>Mobile Number</label>
                  <div className="input-box country-code-input-box"> {/* Added new class */}
                    <input
                      type="text"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      maxLength="4" // e.g., +91
                      className="country-code-input"
                    />
                    <input
                      type="tel"
                      pattern="[0-9]*"
                      placeholder="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => { setMobileNumber(e.target.value); setMobileError(validateMobile(e.target.value)); }}
                    />
                  </div>
                </div>
                {mobileError && <p className="error-message">{mobileError}</p>}
                {!showMobilePasswordField && (
                  <p className="login-password-text" onClick={handleLoginUsingPasswordClick}>Login using password</p>
                )}

                {showMobilePasswordField && (
                  <>
                    {/* Password */}
                    <div className="field">
                      <label>Password</label>
                      <div className="input-box">
                        <span className="icon"><FaEye /></span>
                        <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                        <span className="icon right" onClick={togglePasswordVisibility}>
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                      <a className="forgot" onClick={handleForgotPasswordClick}>Forgot Password?</a>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Login button */}
            {auth.error && <p className="error-message">{auth.error}</p>}
            <button className="login-btn" onClick={handleLoginSubmit} disabled={auth.loading}>{auth.loading ? 'Logging in...' : 'LOG IN'}</button>

            {/* Divider */}
            <div className="divider">
              <span>Or</span>
            </div>

            {/* Social login */}
            <div className="social-grid">
              <button className="social-btn google"><FaGoogle /><span className="social-btn-text">Continue with Google</span></button>
              <button className="social-btn apple"><FaApple /><span className="social-btn-text">Continue with Apple</span></button>
              <button className="social-btn facebook"><FaFacebook /><span className="social-btn-text">Continue with Facebook</span></button>
              <button className="social-btn twitter"><FaTwitter /><span className="social-btn-text">Continue with Twitter</span></button>
            </div>

            {/* Terms */}
            <p className="terms">
              By proceeding further you agree to our
              <strong>Terms & conditions</strong> and
              <strong>Privacy policy</strong>
            </p>
          </div>
        ) : showSignupForm ? (
          // New Signup Form
          <div className="login-card"> {/* Reusing login-card styles for now */}
            <h2>Sign Up Using Number or email</h2>

            {/* Tabs */}
            <div className="login-tabs">
              <button className={`tab-btn ${activeTab === 'mobile' ? 'active' : ''}`} onClick={() => handleTabClick('mobile')}>Mobile</button>
              <button className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`} onClick={() => handleTabClick('email')}>Email</button>
            </div>

            {activeTab === 'email' && (
              <>
                {/* Email */}
                <div className="field">
                  <label>Email Address</label>
                  <div className="input-box">
                    <span className="icon"><FaEnvelope /></span>
                    <input type="email" placeholder="Email" value={emailAddress} onChange={(e) => { setEmailAddress(e.target.value); setEmailError(validateEmail(e.target.value)); }} />
                  </div>
                </div>
                {emailError && <p className="error-message">{emailError}</p>}
                {/* Password field always visible for email */}
                <div className="field">
                  <label>Password</label>
                  <div className="input-box">
                    <span className="icon"><FaEye /></span>
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                    <span className="icon right" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                {/* Confirm Password */}
                <div className="field">
                  <label>Confirm Password</label>
                  <div className="input-box">
                    <span className="icon"><FaEye /></span>
                    <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
                    <span className="icon right" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'mobile' && (
              <>
                {/* Mobile Number */}
                <div className="field">
                  <label>Mobile Number</label>
                  <div className="input-box country-code-input-box"> {/* Added new class */}
                    <input
                      type="text"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      maxLength="4" // e.g., +91
                      className="country-code-input"
                    />
                    <input
                      type="tel"
                      pattern="[0-9]*"
                      placeholder="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => { setMobileNumber(e.target.value); setMobileError(validateMobile(e.target.value)); }}
                    />
                  </div>
                </div>
                {mobileError && <p className="error-message">{mobileError}</p>}
                {/* Password */}
                <div className="field">
                  <label>Password</label>
                  <div className="input-box">
                    <span className="icon"><FaEye /></span>
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                    <span className="icon right" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                {/* Confirm Password */}
                <div className="field">
                  <label>Confirm Password</label>
                  <div className="input-box">
                    <span className="icon"><FaEye /></span>
                    <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
                    <span className="icon right" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </>
            )}

            {signupFormError && <p className="error-message">{signupFormError}</p>}
            {passwordMismatchError && <p className="error-message">Passwords do not match!</p>}
            {/* Sign Up button */}
            {auth.error && <p className="error-message">{auth.error}</p>}
            <button className="login-btn" onClick={handleSignupSubmit} disabled={auth.loading}>{auth.loading ? 'Signing up...' : 'SIGN UP'}</button>

            {/* Divider */}
            <div className="divider">
              <span>Or</span>
            </div>

            {/* Social login */}
            <div className="social-grid">
              <button className="social-btn google"><FaGoogle /><span className="social-btn-text">Continue with Google</span></button>
              <button className="social-btn apple"><FaApple /><span className="social-btn-text">Continue with Apple</span></button>
              <button className="social-btn facebook"><FaFacebook /><span className="social-btn-text">Continue with Facebook</span></button>
              <button className="social-btn twitter"><FaTwitter /><span className="social-btn-text">Continue with Twitter</span></button>
            </div>

            {/* Terms */}
            <p className="terms">
              By proceeding further you agree to our
              <strong>Terms & conditions</strong> and
              <strong>Privacy policy</strong>
            </p>
          </div>
        ) : showOtpCard ? (
          // OTP Card
          <div className="otp-wrapper">
            <div className="otp-card">

              <h2>OTP Verification</h2>
              <p className="otp-desc">
                A 4 digit OTP code has been sent to
                <strong> {otpRecipient} </strong>.
                Please enter the code to continue.
              </p>

              <p className="otp-label">Verification Code</p>

              <div className="otp-inputs">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={val}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(-1);
                      setOtpValues((prev) => {
                        const next = [...prev];
                        next[idx] = v;
                        return next;
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) {
                        const prevEl = e.target.previousSibling;
                        if (prevEl) prevEl.focus();
                      }
                    }}
                    onInput={(e) => {
                      if (e.target.value && e.target.nextSibling) {
                        e.target.nextSibling.focus();
                      }
                    }}
                  />
                ))}
              </div>

              {(signupFormError || auth.error) && <p className="error-message">{signupFormError || auth.error}</p>}

              <button className="otp-primary" onClick={handleOtpVerification} disabled={otpValues.join('').length !== 4 || auth.loading}>{auth.loading ? 'Verifying...' : 'NEXT'}</button>
              <button className="otp-secondary" onClick={() => dispatch(sendOtp({ recipient: otpRecipient }))} disabled={auth.loading}>{auth.loading ? 'Resending...' : 'RESEND CODE'}</button>

            </div>
          </div>
        ) : showResetPasswordCard ? (
          // New Reset Password Card
          <div className="login-card"> {/* Reusing login-card styles */}
            <h2>Reset Password</h2>
            <p className="subtitle">Enter your new password</p>

            {/* New Password */}
            <div className="field">
              <label>New Password</label>
              <div className="input-box">
                <span className="icon"><FaEye /></span>
                <input type={showPassword ? 'text' : 'password'} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <span className="icon right" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="field">
              <label>Confirm New Password</label>
              <div className="input-box">
                <span className="icon"><FaEye /></span>
                <input type={showPassword ? 'text' : 'password'} placeholder="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                <span className="icon right" onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {resetPasswordError && <p className="error-message">{resetPasswordError}</p>}
            {auth.error && <p className="error-message">{auth.error}</p>}

            {/* Confirm Password button */}
            <button className="login-btn" onClick={handleResetPasswordSubmit} disabled={auth.loading || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword}>{auth.loading ? 'Processing...' : 'Confirm Password'}</button>
          </div>
        ) : showForgotPasswordCard ? ( // Moved this condition up
          // Forgot Password Card
          <div className="login-card"> {/* Reusing login-card styles */}
            <h2>Forgot Password?</h2>

            {activeTab === 'email' && (
              <>
                {/* Email */}
                <div className="field">
                  <label>Email Address</label>
                  <div className="input-box">
                    <span className="icon"><FaEnvelope /></span>
                    <input type="email" placeholder="Email" value={emailAddress} onChange={(e) => { setEmailAddress(e.target.value); setEmailError(validateEmail(e.target.value)); }} />
                  </div>
                </div>
                {emailError && <p className="error-message">{emailError}</p>}
              </>
            )}

            {activeTab === 'mobile' && (
              <>
                {/* Mobile Number */}
                <div className="field">
                  <label>Mobile Number</label>
                  <div className="input-box country-code-input-box"> {/* Added new class */}
                    <input
                      type="text"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      maxLength="4" // e.g., +91
                      className="country-code-input"
                    />
                    <input
                      type="tel"
                      pattern="[0-9]*"
                      placeholder="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => { setMobileNumber(e.target.value); setMobileError(validateMobile(e.target.value)); }}
                    />
                  </div>
                </div>
                {mobileError && <p className="error-message">{mobileError}</p>}
              </>
            )}

            {/* Get Otp button */}
            {auth.error && <p className="error-message">{auth.error}</p>}
            <button className="login-btn" onClick={handleGetOtpClick} disabled={auth.loading}>{auth.loading ? 'Sending...' : 'Get Otp'}</button>

            {/* Divider */}
            <div className="divider">
              <span>Or</span>
            </div>

            {/* Social login */}
            <div className="social-grid">
              <button className="social-btn google"><FaGoogle /><span className="social-btn-text">Continue with Google</span></button>
              <button className="social-btn apple"><FaApple /><span className="social-btn-text">Continue with Apple</span></button>
              <button className="social-btn facebook"><FaFacebook /><span className="social-btn-text">Continue with Facebook</span></button>
              <button className="social-btn twitter"><FaTwitter /><span className="social-btn-text">Continue with Twitter</span></button>
            </div>

            {/* Terms */}
            <p className="terms">
              By proceeding further you agree to our
              <strong>Terms & conditions</strong> and
              <strong>Privacy policy</strong>
            </p>
          </div>
        ) : (
          null
        )}
      </div>
    </div>
  );
}

export default AuthenticationPage;