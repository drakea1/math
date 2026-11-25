'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const handleBackNavigation = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      router.push('/home');
    } else {
      router.push('/login-signup');
    }
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });

    const trimmedEmail = email.trim();
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);

    if (error) {
      setStatus({ loading: false, message: '', error: error.message });
    } else {
      setCode('');
      setStatus({
        loading: false,
        message: `We sent a reset code to ${trimmedEmail}. Enter it below.`,
        error: '',
      });
      setStep('code');
    }
  };

  const handleVerifyResetCode = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'recovery',
    });

    if (error) {
      setStatus({
        loading: false,
        message: '',
        error: error.message || 'Invalid or expired reset code.',
      });
      return;
    }

    setStatus({ loading: false, message: '', error: '' });
    router.push('/reset-password?mode=recovery');
  };

  const handleResendCode = async () => {
    if (!email.trim()) return;
    setStatus({ loading: true, message: '', error: '' });

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) {
      setStatus({ loading: false, message: '', error: error.message });
    } else {
      setStatus({
        loading: false,
        message: 'A new reset code was sent to your email.',
        error: '',
      });
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '440px', width: '100%', margin: '0 auto', color: 'var(--text-main)' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {step === 'email'
              ? 'Enter your email to receive a reset code.'
              : `Enter the code sent to ${email.trim()}.`}
          </p>
        </div>

        {status.error && (
          <p style={{ color: '#ff4a4a', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: '600', textAlign: 'center' }}>
            {status.error}
          </p>
        )}
        {status.message && (
          <p style={{ color: 'var(--accent-neon)', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: '600', textAlign: 'center' }}>
            {status.message}
          </p>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendResetCode} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem', width: '100%' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="input-field"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: '15px',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--accent-neon)',
                color: '#000000',
                borderRadius: '15px',
                fontWeight: '800',
                border: 'none',
                cursor: status.loading ? 'not-allowed' : 'pointer',
                opacity: status.loading ? 0.7 : 1,
                boxShadow: '0 4px 15px var(--accent-neon-glow)',
                marginBottom: '1.5rem'
              }}
            >
              {status.loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyResetCode} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ENTER RESET CODE"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--card-bg)',
                border: '1px solid var(--surface-border)',
                borderRadius: '15px',
                color: 'var(--text-main)',
                textAlign: 'center',
                letterSpacing: '0.25em',
                fontWeight: '700',
                fontSize: '1.1rem',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              disabled={status.loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--accent-neon)',
                color: '#000000',
                borderRadius: '15px',
                fontWeight: '800',
                border: 'none',
                cursor: status.loading ? 'not-allowed' : 'pointer',
                opacity: status.loading ? 0.7 : 1,
                boxShadow: '0 4px 15px var(--accent-neon-glow)',
              }}
            >
              {status.loading ? 'Verifying Code...' : 'Verify Code'}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={status.loading}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'var(--surface-glass)',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--accent-neon)',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: status.loading ? 'not-allowed' : 'pointer',
                }}
              >
                Resend Code
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setStatus({ loading: false, message: '', error: '' });
                }}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'var(--surface-glass)',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--text-main)',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <span
            onClick={handleBackNavigation}
            style={{
              fontSize: '0.85rem',
              color: 'var(--accent-neon)',
              cursor: 'pointer',
              fontWeight: '700',
              textDecoration: 'underline'
            }}
          >
            ← Back to Sign In
          </span>
        </div>
      </div>
    </div>
  );
}