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

  const handleAction = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isSignUp) {
      const check = validateUsername(username);
      if (!check.valid) {
        setErrorMessage(check.error);
        return;
      }

      if (hasMinLength && hasUppercase && hasSpecial && passwordsMatch) {
        // Trigger Supabase Sign Up with username metadata
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
            setIsVerificationSent(true);
          }
        }
      } else {
        setErrorMessage('Please ensure all password requirements are met.');
      }
    } else {
      // Trigger Supabase Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        router.push('/home');
      }
    }
  };

  if (isVerificationSent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: '7rem 1.5rem 4rem', alignItems: 'center', justifyContent: 'center', maxWidth: '440px', width: '100%', margin: '0 auto', color: 'var(--text-main)' }}>
        <div className="verification-screen" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
            Verify Email
          </h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '2rem' }}>
            We sent a verification link to <br />
            <strong style={{ color: 'var(--text-main)' }}>{email}</strong>. <br />
            Please check your inbox to activate your account.
          </p>
          <button 
            className="btn-signin" 
            style={{ width: '100%', cursor: 'pointer' }} 
            onClick={() => {
              setIsVerificationSent(false);
              setIsSignUp(false);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setUsername('');
              setErrorMessage('');
            }}
          >
            Back to Login
          </button>
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
            <p style={{ color: '#ff4a4a', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
              {errorMessage}
            </p>
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
              onClick={() => { setIsSignUp(!isSignUp); setPassword(''); setConfirmPassword(''); setUsername(''); setErrorMessage(''); }}
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