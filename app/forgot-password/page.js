'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient'; // Adjust path if needed

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const handleBackNavigation = async () => {
    // Check if a user session currently exists
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // If already signed in, go straight to home/dashboard
      router.push('/home');
    } else {
      // Otherwise, go back to the sign-in page
      router.push('/');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setStatus({ loading: false, message: '', error: error.message });
    } else {
      setStatus({ loading: false, message: 'Check your email for the reset link!', error: '' });
      setEmail('');
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '440px', width: '100%', margin: '0 auto', color: 'var(--text-main)' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Enter your email to receive a recovery link.</p>
        </div>
        
        <form onSubmit={handleResetPassword} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
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
                background: 'rgba(0, 0, 0, 0.03)', 
                border: '1px solid var(--surface-border)', 
                borderRadius: '15px', 
                color: 'var(--text-main)',
                boxSizing: 'border-box',
                outline: 'none'
              }} 
            />
          </div>
          
          {status.error && <p style={{ color: '#ff4a4a', marginBottom: '1rem', fontSize: '0.8rem', textAlign: 'center' }}>{status.error}</p>}
          {status.message && <p style={{ color: '#18a300', marginBottom: '1rem', fontSize: '0.8rem', textAlign: 'center' }}>{status.message}</p>}

          <button 
            type="submit"
            disabled={status.loading}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'var(--accent-neon)', 
              color: '#000000', 
              borderRadius: '15px', 
              fontWeight: 'bold',
              border: 'none',
              cursor: status.loading ? 'not-allowed' : 'pointer',
              opacity: status.loading ? 0.7 : 1,
              boxShadow: '0 4px 15px var(--accent-neon-glow)',
              marginBottom: '1.5rem'
            }}>
            {status.loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div style={{ textAlign: 'center' }}>
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
        </form>
      </div>
    </div>
  );
}