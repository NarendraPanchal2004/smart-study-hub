import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Hash, ArrowRight } from 'lucide-react';
import axios from 'axios';

const JoinGroup = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('studySyncUser'));
      await axios.post('http://localhost:5000/api/groups/join', 
        { code }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate('/groups');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: '3rem' }}>
        <Hash size={48} color="var(--primary)" style={{ marginBottom: 'var(--spacing-lg)' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>Join a Study Group</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
          Enter the 6-digit code shared by your friend to join their private study room.
        </p>

        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Enter 6-digit code" 
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid var(--border-color)',
              padding: '1rem',
              borderRadius: '1rem',
              fontSize: '1.5rem',
              textAlign: 'center',
              letterSpacing: '0.5rem',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
          {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}
          <button type="submit" className="glass" style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '1rem',
            borderRadius: '1rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            Join Room <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinGroup;
