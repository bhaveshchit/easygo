import React, { useState } from 'react';
import { FaGoogle, FaApple, FaFacebook, FaTwitter, FaEye, FaEyeSlash, FaMobileAlt, FaEnvelope } from 'react-icons/fa';
import './App.css'; // Assuming some shared styling

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
  const [emailError, setEmailError] = useState(''); // State for email validation error
  const [mobileError, setMobileError] = useState(''); // State for mobile number validation error
  const [signupFormError, setSignupFormError] = useState(''); // State for general signup form error
  const [showResetPasswordCard, setShowResetPasswordCard] = useState(false); // New state for Reset Password card visibility
  const [newPassword, setNewPassword] = useState(''); // State for new password input
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // State for confirm new password input
  const [resetPasswordError, setResetPasswordError] = useState(''); // State for reset password validation error
  const [showConfirmationCard, setShowConfirmationCard] = useState(false); // State for confirmation card visibility

  // Validation functions
  const validateEmail = (email) => {
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
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
    // Simulate OTP verification success
    // In a real application, you would send the OTP to your backend for verification
    console.log('OTP verified successfully for:', otpRecipient, 'Purpose:', otpPurpose);

    setShowOtpCard(false);
    if (otpPurpose === 'login') {
      setShowLoginCard(false); // Ensure login card is hidden
      setShowSignupForm(false); // Ensure signup form is hidden
      setShowForgotPasswordCard(false); // Ensure forgot password card is hidden
      setShowResetPasswordCard(false); // Ensure reset password card is hidden
      setShowConfirmationCard(true); // Show confirmation for login
    } else if (otpPurpose === 'reset_password') {
      setShowResetPasswordCard(true); // Show reset password card
    }
    // Clear OTP inputs if they were managed by state
    setOtpPurpose(''); // Clear otpPurpose after use
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
        setOtpRecipient(countryCode + mobileNumber); // Set recipient for OTP
        setOtpPurpose('login'); // Set OTP purpose to 'login'
        setShowOtpCard(true);
        setShowLoginCard(false);
        setShowSignupForm(false);
        setShowForgotPasswordCard(false); // Hide Forgot Password card
        setShowMobilePasswordField(false);
        setShowPassword(false);
      } else {
        // User is trying to login with mobile and password
        console.log('Proceeding with mobile and password login for:', mobileNumber);
        // Simulate successful login and show confirmation card
        setShowLoginCard(false);
        setShowSignupForm(false);
        setShowOtpCard(false);
        setShowForgotPasswordCard(false);
        setShowResetPasswordCard(false);
        setShowConfirmationCard(true);
      }
    } else {
      // For email login, proceed with email/password login logic
      console.log('Proceeding with email login for:', emailAddress);
      // Simulate successful login and show confirmation card
      setShowLoginCard(false);
      setShowSignupForm(false);
      setShowOtpCard(false);
      setShowForgotPasswordCard(false);
      setShowResetPasswordCard(false);
      setShowConfirmationCard(true);
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

    if (activeTab === 'mobile') {
      setOtpRecipient(countryCode + mobileNumber); // Set recipient for OTP
    } else {
      setOtpRecipient(emailAddress); // Set recipient for OTP
    }
    setOtpPurpose('reset_password'); // Set OTP purpose to 'reset_password'
    setShowOtpCard(true);
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

    // If all validations pass, simulate successful signup and show confirmation card
    setShowLoginCard(false);
    setShowSignupForm(false);
    setShowOtpCard(false);
    setShowForgotPasswordCard(false);
    setShowResetPasswordCard(false);
    setShowConfirmationCard(true);
    setSignupPassword(''); // Clear signup password
    setSignupConfirmPassword(''); // Clear signup confirm password
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

    // Here you would typically send the new password to your backend
    console.log('Resetting password for:', otpRecipient, 'with new password:', newPassword);

    // After successful password reset, show confirmation card
    setShowResetPasswordCard(false);
    setShowConfirmationCard(true); // Show confirmation card
    setNewPassword('');
    setConfirmNewPassword('');
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
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" />
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
                        <input type={showPassword ? 'text' : 'password'} placeholder="Password" />
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
            <button className="login-btn" onClick={handleLoginSubmit}>LOG IN</button>

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
            <button className="login-btn" onClick={handleSignupSubmit}>SIGN UP</button>

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
                <input type="text" maxLength="1" value="5" />
                <input type="text" maxLength="1" value="5" />
                <input type="text" maxLength="1" value="5" />
                <input type="text" maxLength="1" value="5" />
              </div>

              <button className="otp-primary" onClick={handleOtpVerification}>NEXT</button>
              <button className="otp-secondary">RESEND CODE</button>

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

            {/* Confirm Password button */}
            <button className="login-btn" onClick={handleResetPasswordSubmit}>Confirm Password</button>
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
            <button className="login-btn" onClick={handleGetOtpClick}>Get Otp</button>

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
        ) : showConfirmationCard ? (
          // Confirmation Card
          <div className="confirm-wrapper">
            <div className="confirm-card">

              <div className="icon-wrapper">
                <div className="icon-circle">
                  <i class="fa-solid fa-check"></i>
                </div>
              </div>

              <h2>Success</h2>

            </div>
          </div>
        ) : (
          null
        )}
      </div>
    </div>
  );
}

export default AuthenticationPage;