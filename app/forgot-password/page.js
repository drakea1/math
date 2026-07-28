'use client';
import { useState } from 'react';
import { supabase } from '../../supabaseClient'; // Adjust path if needed

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

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
    <div style={{ padding: '2rem', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Reset Password</h1>
      <p style={{ marginBottom: '2rem', opacity: 0.6 }}>Enter your email to receive a recovery link.</p>
      
      <form onSubmit={handleResetPassword}>
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          style={{ 
            width: '100%', 
            padding: '1rem', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '15px', 
            color: 'white',
            marginBottom: '1rem' 
          }} 
        />
        
        {status.error && <p style={{ color: '#ff4a4a', marginBottom: '1rem', fontSize: '0.9rem' }}>{status.error}</p>}
        {status.message && <p style={{ color: '#d4ff00', marginBottom: '1rem', fontSize: '0.9rem' }}>{status.message}</p>}

        <button 
          type="submit"
          disabled={status.loading}
          style={{ 
            width: '100%', 
            padding: '1rem', 
            background: 'white', 
            color: 'black', 
            borderRadius: '15px', 
            fontWeight: 'bold',
            cursor: status.loading ? 'not-allowed' : 'pointer',
            opacity: status.loading ? 0.7 : 1
          }}>
          {status.loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}