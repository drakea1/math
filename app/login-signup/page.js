'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

// List of restricted/inappropriate words to block
const profanityList = [
  'admin', 'moderator', 'support', 'staff', 'system', 'matharound', // System & brand keywords
  'damn', 'hell', 'crap', 'shit', 'fuck', 'bitch', 'ass', 'bastard', 'dick', 'pussy', 'cock', 'slut', 'whore' // Common profanity
];

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const validateUsername = (rawUsername) => {
  const username = (rawUsername || '').trim();

  if (username.length < 3) {
    return { valid: false, username, error: 'Username must be at least 3 characters long.' };
  }
  if (username.length > 20) {
    return { valid: false, username, error: 'Username must be 20 characters or fewer.' };
  }
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    return {
      valid: false,
      username,
      error: 'Username can only use letters, numbers, underscores (_), and periods (.).'
    };
  }
  if (/^[._]|[._]$|\.\.|__/.test(username)) {
    return {
      valid: false,
      username,
      error: 'Username cannot start or end with . or _, or contain .. or __.'
    };
  }

  const normalized = username.toLowerCase();
  const hasBlockedWord = profanityList.some((word) => {
    const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegex(word)}([^a-z0-9]|$)`, 'i');
    return pattern.test(normalized);
  });

  if (hasBlockedWord) {
    return { valid: false, username, error: 'Error: Inappropriate or restricted username detected!' };
  }

  return { valid: true, username, error: null };
};

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canVerifyUnconfirmed, setCanVerifyUnconfirmed] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace('/home');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return null;
  }

  // Password requirements validation rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = isSignUp ? password === confirmPassword && password !== '' : true;

  const resetAuthState = (nextSignUp = false) => {
    setIsVerificationSent(false);
    setVerificationCode('');
    setResendMessage('');
    setIsVerifying(false);
    setIsResending(false);
    setCanVerifyUnconfirmed(false);
    setIsSignUp(nextSignUp);
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setErrorMessage('');
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResendMessage('');
    setCanVerifyUnconfirmed(false);

    if (isSignUp) {
      const check = validateUsername(username);
      if (!check.valid) {
        setErrorMessage(check.error);
        return;
      }

      if (hasMinLength && hasUppercase && hasSpecial && passwordsMatch) {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: check.username,
            }
          }
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          if (data?.session) {
            router.push('/home');
          } else {
            setVerificationCode('');
            setIsVerificationSent(true);
          }
        }
      } else {
        setErrorMessage('Please ensure all password requirements are met.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        const isUnconfirmed = /email not confirmed/i.test(error.message || '');
        setCanVerifyUnconfirmed(isUnconfirmed);
        setErrorMessage(
          isUnconfirmed
            ? 'Your email is not confirmed yet. Send a verification code to activate your account.'
            : error.message
        );
      } else {
        router.push('/home');
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResendMessage('');

    const token = verificationCode.trim();
    if (!token) {
      setErrorMessage('Please enter the verification code from your email.');
      return;
    }

    setIsVerifying(true);

    let { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (error) {
      const fallback = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      data = fallback.data;
      error = fallback.error;
    }

    setIsVerifying(false);

    if (error) {
      setErrorMessage(error.message || 'Invalid or expired verification code.');
      return;
    }

    if (data?.session || data?.user) {
      router.push('/home');
    } else {
      router.push('/home');
    }
  };

  const handleResendCode = async () => {
    setErrorMessage('');
    setResendMessage('');
    setIsResending(true);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    setIsResending(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setResendMessage('A new verification code was sent to your email.');
    }
  };

  const handleSendCodeFromLogin = async () => {
    if (!email) return;
    setErrorMessage('');
    setResendMessage('');
    setIsResending(true);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    setIsResending(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setCanVerifyUnconfirmed(false);
      setVerificationCode('');
      setResendMessage('We sent a verification code to your email.');
      setIsVerificationSent(true);
    }
  };

  if (isVerificationSent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: '7rem 1.5rem 4rem', alignItems: 'center', justifyContent: 'center', maxWidth: '440px', width: '100%', margin: '0 auto', color: 'var(--text-main)' }}>
        <header
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'var(--card-bg)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '1.1rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid var(--surface-border)',
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: '900',
              fontSize: '1.8rem',
              color: 'var(--accent-neon)',
              textShadow: '0 0 10px var(--accent-neon-glow)',
              lineHeight: 1.1,
              textDecoration: 'none',
            }}
          >
            MathAround
          </Link>
        </header>

        <div className="verification-screen" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>
            Verify Email
          </h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            We sent a verification code to <br />
            <strong style={{ color: 'var(--text-main)' }}>{email}</strong>. <br />
            Enter the code below to activate your account.
          </p>

          <form onSubmit={handleVerifyCode} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <input
              className="input-field"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="ENTER VERIFICATION CODE"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'center',
                letterSpacing: '0.25em',
                fontWeight: '700',
                fontSize: '1.1rem',
              }}
            />

            {errorMessage && (
              <p style={{ color: '#ff4a4a', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
                {errorMessage}
              </p>
            )}

            {resendMessage && (
              <p style={{ color: 'var(--accent-neon)', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
                {resendMessage}
              </p>
            )}

            <button
              type="submit"
              className="btn-signin"
              disabled={isVerifying}
              style={{ width: '100%', cursor: isVerifying ? 'not-allowed' : 'pointer', padding: '12px', opacity: isVerifying ? 0.7 : 1 }}
            >
              {isVerifying ? 'Verifying Code...' : 'Confirm Email'}
            </button>
          </form>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--surface-glass)',
                border: '1px solid var(--surface-border)',
                color: 'var(--accent-neon)',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: isResending ? 'not-allowed' : 'pointer',
                opacity: isResending ? 0.7 : 1,
              }}
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('');
                resetAuthState(false);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--surface-glass)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-main)',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: '8rem 1.5rem 2.5rem', alignItems: 'center', justifyContent: 'center', maxWidth: '440px', width: '100%', margin: '0 auto', color: 'var(--text-main)' }}>

      {/* --- VISUAL HEADER START --- */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'var(--card-bg)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '1.1rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid var(--surface-border)',
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: '900',
            fontSize: '1.8rem',
            color: 'var(--accent-neon)',
            textShadow: '0 0 10px var(--accent-neon-glow)',
            lineHeight: 1.1,
            textDecoration: 'none',
          }}
        >
          MathAround
        </Link>
      </header>
      {/* --- VISUAL HEADER END --- */}

      {/* AUTH CARD CONTAINER */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'var(--surface-glass)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: '700',
              textDecoration: 'none',
              marginBottom: '1.15rem',
            }}
          >
            <span style={{ color: 'var(--accent-neon)' }}>←</span>
            <span>Explore MathAround</span>
          </Link>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: '500' }}>
            {isSignUp ? 'Get started' : 'Welcome back'}
          </h2>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px', margin: 0 }}>
            {isSignUp ? 'Sign Up.' : 'Sign In.'}
          </h1>
        </div>

        <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

          {errorMessage && (
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <p style={{ color: '#ff4a4a', fontSize: '0.8rem', margin: 0 }}>
                {errorMessage}
              </p>
              {canVerifyUnconfirmed && email && (
                <button
                  type="button"
                  onClick={handleSendCodeFromLogin}
                  disabled={isResending}
                  style={{
                    marginTop: '0.65rem',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--surface-glass)',
                    border: '1px solid var(--accent-neon)',
                    color: 'var(--accent-neon)',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: isResending ? 'not-allowed' : 'pointer',
                    opacity: isResending ? 0.7 : 1,
                  }}
                >
                  {isResending ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              )}
            </div>
          )}

          {isSignUp && (
            <div style={{ marginBottom: '1rem', width: '100%' }}>
              <input
                className="input-field"
                placeholder="USERNAME"
                type="text"
                maxLength={20}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                3–20 chars · letters, numbers, _ or . (no leading/trailing or repeated symbols)
              </p>
            </div>
          )}

          <div style={{ marginBottom: '1rem', width: '100%' }}>
            <input
              className="input-field"
              placeholder="EMAIL ADDRESS"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div className="password-container" style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
            <input
              className="input-field"
              placeholder="PASSWORD"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem' }}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          {!isSignUp && (
            <div
              className="forgot-password-link"
              onClick={() => router.push('/forgot-password')}
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'right',
                marginTop: '-5px',
                marginBottom: '15px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Forgot Password?
            </div>
          )}

          {isSignUp && password.length > 0 && (
            <div className="validation-checklist" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
              <div className={`checklist-item ${hasMinLength ? 'valid' : 'invalid'}`}>
                <span className="dot"></span> 8+ Characters
              </div>
              <div className={`checklist-item ${hasUppercase ? 'valid' : 'invalid'}`}>
                <span className="dot"></span> 1 Uppercase Letter
              </div>
              <div className={`checklist-item ${hasSpecial ? 'valid' : 'invalid'}`}>
                <span className="dot"></span> 1 Special Char
              </div>
              {confirmPassword.length > 0 && (
                <div className={`checklist-item ${passwordsMatch ? 'valid' : 'invalid'}`}>
                  <span className="dot"></span> Passwords Match
                </div>
              )}
            </div>
          )}

          {isSignUp && (
            <div className="password-container" style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
              <input
                className="input-field"
                placeholder="CONFIRM PASSWORD"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem' }}
              >
                {showConfirmPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          )}

          <p className="toggle-auth-text" style={{ textAlign: 'center', fontSize: '0.85rem', margin: '1.2rem 0' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span
              onClick={() => { setIsSignUp(!isSignUp); setPassword(''); setConfirmPassword(''); setUsername(''); setErrorMessage(''); setCanVerifyUnconfirmed(false); }}
              style={{ color: 'var(--accent-neon)', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>

          {isSignUp && (
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
              By creating an account, you agree to our{' '}
              <Link href="/terms-and-conditions" style={{ color: 'var(--accent-neon)', fontWeight: '700', textDecoration: 'underline' }}>
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy" style={{ color: 'var(--accent-neon)', fontWeight: '700', textDecoration: 'underline' }}>
                Privacy Policy
              </Link>.
            </p>
          )}

          <button type="submit" className="btn-signin" style={{ width: '100%', cursor: 'pointer', padding: '12px' }}>
            {isSignUp ? 'Create Account' : 'Sign In Now'}
          </button>
        </form>
      </div>

      {/* PUBLIC LEGAL FOOTER */}
      <footer style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <Link href="/terms-and-conditions" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
          Terms and Conditions
        </Link>
        <span>•</span>
        <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}