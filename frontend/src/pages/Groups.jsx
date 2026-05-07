import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus, Users, Search, X } from 'lucide-react';
import { getUserGroups, createGroup, joinGroup } from '../services/groupService';
import styles from './Groups.module.css';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await getUserGroups();
      setGroups(data);
    } catch (err) {
      console.error('Failed to fetch groups', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await createGroup(newGroupName, newGroupDesc);
      setShowCreateModal(false);
      setNewGroupName('');
      setNewGroupDesc('');
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      await joinGroup(joinCode);
      setShowJoinModal(false);
      setJoinCode('');
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Study Groups</h1>
        <div className={styles.actions}>
          <button className={`${styles.actionBtn} ${styles.joinBtn}`} onClick={() => setShowJoinModal(true)}>
            <UserPlus size={20} />
            <span>Join Group</span>
          </button>
          <button className={`${styles.actionBtn} ${styles.createBtn}`} onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="fade-in">Loading groups...</div>
      ) : (
        <div className={styles.grid}>
          {groups.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <Users size={48} style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }} />
              <h3>No groups yet</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Create or join a group to start collaborating!</p>
            </div>
          ) : (
            groups.map((group) => (
              <div 
                key={group._id} 
                className={`${styles.groupCard} glass-card`}
                onClick={() => navigate(`/groups/${group._id}`)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    {group.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className={styles.codeBadge}>{group.code}</span>
                </div>
                <div>
                  <h3 className={styles.groupName}>{group.name}</h3>
                  <p className={styles.groupDesc}>{group.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.memberCount}>
                    <Users size={16} />
                    <span>{group.members.length} Members</span>
                  </div>
                  <Search size={18} style={{ color: 'var(--primary)' }} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.header}>
              <h2 className={styles.modalTitle}>Create New Group</h2>
              <button onClick={() => setShowCreateModal(false)}><X /></button>
            </div>
            {error && <div className="error">{error}</div>}
            <form className={styles.form} onSubmit={handleCreateGroup}>
              <div className={styles.inputGroup}>
                <label>Group Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Physics Study Circle" 
                  className={styles.inputField}
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea 
                  placeholder="What is this group about?" 
                  className={styles.inputField}
                  rows="3"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.header}>
              <h2 className={styles.modalTitle}>Join with Code</h2>
              <button onClick={() => setShowJoinModal(false)}><X /></button>
            </div>
            {error && <div className="error">{error}</div>}
            <form className={styles.form} onSubmit={handleJoinGroup}>
              <div className={styles.inputGroup}>
                <label>Invite Code</label>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit Code" 
                  className={styles.inputField}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  maxLength="6"
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowJoinModal(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Join Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
