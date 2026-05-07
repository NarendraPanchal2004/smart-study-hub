import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import styles from './Auth.module.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
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
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join StudySync and start growing together.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={20} />
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Narendra Panchal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input 
                type="email" 
                className={styles.input} 
                placeholder="narendra@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input 
                type="password" 
                className={styles.input} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
            {!loading && <ArrowRight size={20} style={{ marginLeft: 'var(--spacing-xs)' }} />}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account? <Link to="/login" className={styles.link}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
