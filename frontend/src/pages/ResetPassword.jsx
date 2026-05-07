import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './Auth.module.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await resetPassword(email, password);
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.authCard} glass`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Zap className={styles.logoIcon} size={32} fill="currentColor" />
            <span className={styles.logoText}>StudySync</span>
          </div>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>Resetting password for: <strong>{email}</strong></p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '15px', borderRadius: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} /> {message}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>New Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input 
                type="password" 
                className={styles.input} 
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input 
                type="password" 
                className={styles.input} 
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
            {!loading && <ArrowRight size={20} style={{ marginLeft: 'var(--spacing-xs)' }} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
