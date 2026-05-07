import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Zap, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import styles from './Auth.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage('Verification link sent! You can now reset your password.');
      // Auto redirect to reset page for demo
      setTimeout(() => navigate(`/reset-password?email=${email}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request');
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
          <h1 className={styles.title}>Forgot Password?</h1>
          <p className={styles.subtitle}>Enter your email to receive a reset link.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '15px', borderRadius: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} /> {message}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input 
                type="email" 
                className={styles.input} 
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Send Reset Link'}
            {!loading && <ArrowRight size={20} style={{ marginLeft: 'var(--spacing-xs)' }} />}
          </button>
        </form>

        <div className={styles.footer}>
          <Link to="/login" className={styles.link} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
