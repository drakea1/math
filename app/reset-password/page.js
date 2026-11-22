'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

export default function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });
  
  // Validation state
  const [validation, setValidation] = useState({ length: false, upper: false, special: false });
  const router = useRouter();

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    
    // Update validation indicators in real-time
    setValidation({
      length: val.length >= 8,
      upper: /[A-Z]/.test(val),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
    });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });

    if (!validation.length || !validation.upper || !validation.special) {
      return setStatus({ loading: false, message: '', error: 'Password does not meet requirements.' });
    }
    if (password !== confirmPassword) {
      return setStatus({ loading: false, message: '', error: 'Passwords do not match.' });
    }

    // 1. Get the current logged-in user's email
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.email) {
      return setStatus({ loading: false, message: '', error: 'User session not found. Please log in again.' });
    }

    // 2. Verify current password by attempting to sign in with it
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return setStatus({ loading: false, message: '', error: 'Incorrect current password.' });
    }

    // 3. Update to the new password
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setStatus({ loading: false, message: '', error: error.message });
    } else {
      setStatus({ loading: false, message: 'Password updated successfully! Redirecting...', error: '' });
      setTimeout(() => router.push('/'), 2000);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '440px', minHeight: '100dvh', margin: '0 auto', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      {/* BACK BUTTON */}
      <button 
        onClick={() => router.push('/profile')} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-muted)', 
          marginBottom: '1.5rem', 
          cursor: 'pointer', 
          fontWeight: '700', 
          fontSize: '0.95rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.4rem',
          padding: 0
        }}
      >
        ← Back to Settings
      </button>

      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-1px' }}>Create New Password</h1>
      
      <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        
        {/* CURRENT PASSWORD INPUT */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type={showCurrentPassword ? "text" : "password"} 
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'var(--card-bg)', 
              border: '1px solid var(--surface-border)', 
              borderRadius: '15px', 
              color: 'var(--text-main)', 
              paddingRight: '4rem', 
              outline: 'none',
              fontWeight: '600',
              boxSizing: 'border-box'
            }} 
          />
          <button 
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent-neon)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
          >
            {showCurrentPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        {/* FORGOT PASSWORD LINK */}
        <div style={{ textAlign: 'right', marginTop: '-5px', marginBottom: '5px' }}>
          <span 
            onClick={() => router.push('/forgot-password')}
            style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              textDecoration: 'underline' 
            }}
          >
            Forgot Password?
          </span>
        </div>

        {/* NEW PASSWORD INPUT */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            required
            value={password}
            onChange={handlePasswordChange}
            placeholder="New Password"
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'var(--card-bg)', 
              border: '1px solid var(--surface-border)', 
              borderRadius: '15px', 
              color: 'var(--text-main)', 
              paddingRight: '4rem', 
              outline: 'none',
              fontWeight: '600',
              boxSizing: 'border-box'
            }} 
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent-neon)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
          >
            {showPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        {/* VALIDATION INDICATORS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: validation.length ? 'var(--accent-neon)' : 'var(--text-muted)', fontWeight: '600' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: validation.length ? 'var(--accent-neon)' : 'var(--text-muted)' }} />
            8+ Characters
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: validation.upper ? 'var(--accent-neon)' : 'var(--text-muted)', fontWeight: '600' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: validation.upper ? 'var(--accent-neon)' : 'var(--text-muted)' }} />
            1 Uppercase
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: validation.special ? 'var(--accent-neon)' : 'var(--text-muted)', fontWeight: '600' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: validation.special ? 'var(--accent-neon)' : 'var(--text-muted)' }} />
            1 Special Char
          </div>
        </div>

        {/* CONFIRM PASSWORD INPUT */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'var(--card-bg)', 
              border: '1px solid var(--surface-border)', 
              borderRadius: '15px', 
              color: 'var(--text-main)', 
              paddingRight: '4rem', 
              outline: 'none',
              fontWeight: '600',
              boxSizing: 'border-box'
            }} 
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--accent-neon)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
          >
            {showConfirmPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>
        
        {status.error && <p style={{ color: '#ff4a4a', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>{status.error}</p>}
        {status.message && <p style={{ color: 'var(--accent-neon)', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>{status.message}</p>}

        <button 
          type="submit"
          disabled={status.loading}
          style={{ 
            width: '100%', padding: '1rem', background: 'var(--accent-neon)', color: '#000', borderRadius: '15px', border: 'none',
            fontWeight: '900', marginTop: '0.5rem', cursor: status.loading ? 'not-allowed' : 'pointer', opacity: status.loading ? 0.7 : 1,
            boxShadow: '0 0 20px var(--accent-neon-glow, rgba(0,0,0,0.1))'
          }}>
          {status.loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}