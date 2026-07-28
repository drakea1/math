'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';

export default function Home() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. UPDATED REGEX: Matches your new 8 chars, 1 uppercase, 1 special character rule
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = isSignUp ? password === confirmPassword && password !== '' : true;

  const handleAction = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isSignUp) {
      if (hasMinLength && hasUppercase && hasSpecial && passwordsMatch) {
        // Trigger Supabase Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          // 2. THE MAGIC DOOR: Send new sign-ups to the onboarding screen!
          router.push('/onboarding');
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
        // 3. Keep normal Log Ins going straight to the dashboard
        router.push('/home');
      }
    }
  };

  if (isVerificationSent) {
    return (
      <div className="verification-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="success-icon">⚡</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>
          Verify Email
        </h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6', fontSize: '0.95rem' }}>
          We sent a verification link to <br />
          <strong style={{ color: '#fff' }}>{email}</strong>. <br />
          Please check your inbox to activate your account.
        </p>
        <button className="btn-signin" style={{ marginTop: '3rem' }} onClick={() => setIsVerificationSent(false)}>
          Back to Login
        </button>
      </div>
    );
  }

  return (
   <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '9rem  1.5rem', justifyContent: 'flex-start' }}>

    {/* --- VISUAL HEADER START --- */}
    <header style={{
      position: 'fixed',      
      top: 0,                
      left: 0,                
      width: '100%',          
      backgroundColor: 'var(--accent-glow)',
      zIndex: 1000,          
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: '1.5rem',    
      paddingBottom: '0.8rem',
      borderBottom: '2px solid var(--text-main)'
    }}>
      <div style={{
        fontWeight: '900',
        fontSize: '2.1rem',
        color: 'var(--accent-neon)',
        textShadow: '0 0 10px var(--accent-neon-glow)'
      }}>
        MathAround
      </div>
      <nav style={{ display: 'flex', gap: '1rem' }}></nav>
    </header>
    {/* --- VISUAL HEADER END --- */}

      <div style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: '500' }}>
          {isSignUp ? 'Get started' : 'Welcome back'}
        </h2>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1.5px', margin: 0 }}>
          {isSignUp ? 'Sign Up.' : 'Sign In.'}
        </h1>
      </div>
      
      <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {errorMessage && (
          <p style={{ color: '#ff4a4a', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>
            {errorMessage}
          </p>
        )}

        {isSignUp && (
          <input
            className="input-field"
            placeholder="FULL NAME"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        
        <input
          className="input-field"
          placeholder="EMAIL ADDRESS"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className="password-container">
          <input
            className="input-field"
            placeholder="PASSWORD"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isSignUp && (
            <div
              className="forgot-password-link"
              onClick={() => router.push('/forgot-password')}
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'right',
                marginTop: '-5px',
                marginBottom: '20px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Forgot Password?
            </div>
          )}
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        {isSignUp && password.length > 0 && (
          <div className="validation-checklist">
            <div className={`checklist-item ${hasMinLength ? 'valid' : 'invalid'}`}>
              <span className="dot"></span> 8+ Characters
            </div>
            <div className={`checklist-item ${hasUppercase ? 'valid' : 'invalid'}`}>
              <span className="dot"></span> 1 Uppercase Letter
            </div>
            {/* UPDATED UI CHECKLIST ITEM */}
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
          <div className="password-container">
            <input
              className="input-field"
              placeholder="CONFIRM PASSWORD"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        )}
        
        <p className="toggle-auth-text">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => { setIsSignUp(!isSignUp); setPassword(''); setConfirmPassword(''); setErrorMessage(''); }}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
        
        <button type="submit" className="btn-signin">
          {isSignUp ? 'Create Account' : 'Sign In Now'}
        </button>
      </form>
    </div>
  );
}