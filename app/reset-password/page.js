'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setStatus({ loading: false, message: '', error: error.message });
    } else {
      setStatus({ loading: false, message: 'Password updated successfully! Redirecting...', error: '' });
      // Redirect to home/sign-in page
      setTimeout(() => router.push('/'), 2000);
    }
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ marginBottom: '2rem' }}>Create New Password</h1>
      
      <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* NEW PASSWORD INPUT */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            required
            value={password}
            onChange={handlePasswordChange}
            placeholder="New Password"
            style={{ 
              width: '100%', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '15px', color: 'white', paddingRight: '4rem'
            }} 
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: '#d4ff00', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
          >
            {showPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        {/* VALIDATION INDICATORS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: validation.length ? '#d4ff00' : 'gray' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: validation.length ? '#d4ff00' : 'gray' }} />
            8+ Characters
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: validation.upper ? '#d4ff00' : 'gray' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: validation.upper ? '#d4ff00' : 'gray' }} />
            1 Uppercase
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: validation.special ? '#d4ff00' : 'gray' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: validation.special ? '#d4ff00' : 'gray' }} />
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
              width: '100%', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '15px', color: 'white', paddingRight: '4rem'
            }} 
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: '#d4ff00', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
          >
            {showConfirmPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>
        
        {status.error && <p style={{ color: '#ff4a4a', fontSize: '0.9rem' }}>{status.error}</p>}
        {status.message && <p style={{ color: '#d4ff00', fontSize: '0.9rem' }}>{status.message}</p>}

        <button 
          type="submit"
          disabled={status.loading}
          style={{ 
            width: '100%', padding: '1rem', background: 'white', color: 'black', borderRadius: '15px', 
            fontWeight: 'bold', marginTop: '1rem', cursor: status.loading ? 'not-allowed' : 'pointer', opacity: status.loading ? 0.7 : 1
          }}>
          {status.loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}