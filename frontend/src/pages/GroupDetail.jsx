import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  MoreVertical,
  Calendar,
  Target,
  Trash2,
  Video
} from 'lucide-react';
import io from 'socket.io-client';
import { getGroupDetails } from '../services/groupService';
import { getMessages, sendMessage, uploadFile, deleteMessage } from '../services/messageService';
import { getTasks, addTask, updateTask } from '../services/taskService';
import { getTimetable, addEvent } from '../services/timetableService';
import { useAuth } from '../context/AuthContext';
import styles from './GroupDetail.module.css';

const socket = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`);

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupTasks, setGroupTasks] = useState([]);
  const [groupEvents, setGroupEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(true);
  const [showMeeting, setShowMeeting] = useState(false);
  const scrollRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupData = await getGroupDetails(id);
        setGroup(groupData);
        const msgData = await getMessages(id);
        setMessages(msgData);
        
        const tasksData = await getTasks(id);
        setGroupTasks(tasksData);
        
        const eventsData = await getTimetable(id);
        setGroupEvents(eventsData);
        
        socket.emit('join-group', id);
      } catch (err) {
        console.error('Error fetching group data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on('receive-message', (message) => {
      if (message.groupId === id) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('message-deleted', (msgId) => {
      setMessages(prev => prev.filter(m => m._id !== msgId));
    });

    socket.on('incoming-call', ({ senderName }) => {
      if (senderName !== user.name) {
        alert(`${senderName} is starting a video call! Click OK to see the join button in chat.`);
        setActiveTab('chat');
      }
    });

    return () => {
      socket.off('receive-message');
      socket.off('message-deleted');
      socket.off('incoming-call');
    };
  }, [id, user.name]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      groupId: id,
      text: newMessage,
      type: 'text'
    };

    try {
      const savedMsg = await sendMessage(messageData);
      socket.emit('send-message', savedMsg);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { url, filename } = await uploadFile(file);
      const messageData = {
        groupId: id,
        text: `Shared a file: ${filename}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileUrl: url
      };
      const savedMsg = await sendMessage(messageData);
      socket.emit('send-message', savedMsg);
    } catch (err) {
      console.error('File upload failed', err);
    }
  };

  const handleDeleteMsg = async (msgId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage(msgId);
      socket.emit('delete-message', { id: msgId, groupId: id });
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  const handleStartMeeting = async () => {
    setShowMeeting(true);
    setActiveTab('chat');

    try {
      const messageData = {
        groupId: id,
        text: `[CALL_START] started a video call`,
        type: 'text' // Using 'text' to ensure backend saves it even if enum is old
      };
      const savedMsg = await sendMessage(messageData);
      socket.emit('send-message', savedMsg);
      socket.emit('call-started', { groupId: id, senderName: user.name });
    } catch (err) {
      console.error('Failed to send call notification', err);
    }
  };

  if (loading) return <div>Loading group...</div>;
  if (!group) return <div>Group not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.groupInfo}>
          <h1>{group.name}</h1>
          <p>{group.members.length} members • {group.code}</p>
        </div>
        <div className={styles.headerAction}>
          <button 
            className={`${styles.iconBtn} ${styles.videoBtn}`} 
            onClick={handleStartMeeting}
            title="Start Video Meeting"
          >
            <Video />
            <span>Join Meeting</span>
          </button>
          <button className={styles.iconBtn}><MoreVertical /></button>
        </div>
      </div>

      <div className={styles.tabs}>
        <div 
          className={`${styles.tab} ${activeTab === 'chat' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Discussion
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'materials' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Resources
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'timetable' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('timetable')}
        >
          Timetable & Goals
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === 'chat' && (
          <div className={styles.chatContainer}>
            <div className={styles.messageList} ref={scrollRef}>
              {messages.map((msg) => (
                <div key={msg._id} className={`${styles.message} ${msg.senderId === user._id ? styles.myMessage : ''}`}>
                  {msg.senderId !== user._id && (
                    <img src={msg.senderAvatar} alt="" className={styles.avatar} />
                  )}
                  <div className={styles.msgContent}>
                    {msg.senderId !== user._id && (
                      <span className={styles.senderName}>{msg.senderName}</span>
                    )}
                    <div className={`${styles.bubble} ${msg.senderId === user._id ? styles.myBubble : ''}`}>
                      {msg.type === 'text' && msg.text.startsWith('[CALL_START]') ? (
                        <div className={styles.callBubbleContent}>
                          <div className={styles.callHeader}>
                            <Video size={16} />
                            <strong>Video Call</strong>
                          </div>
                          <p style={{ margin: '8px 0', fontSize: '0.85rem' }}>{msg.text.replace('[CALL_START]', '')}</p>
                          <button 
                            className={styles.joinCallBtn} 
                            onClick={() => setShowMeeting(true)}
                          >
                            Join Call
                          </button>
                        </div>
                      ) : msg.type === 'text' ? (
                        msg.text
                      ) : msg.type === 'image' ? (
                        <img src={msg.fileUrl} alt="shared" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                      ) : (
                        <a href={msg.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileText size={20} />
                          {msg.text}
                        </a>
                      )}
                    </div>
                  </div>
                  {msg.senderId === user._id && (
                    <button 
                      className={styles.deleteMsgBtn} 
                      onClick={() => handleDeleteMsg(msg._id)}
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <form className={styles.inputArea} onSubmit={handleSendMessage}>
              <button 
                type="button" 
                className={styles.iconBtn} 
                onClick={handleStartMeeting}
                title="Start Video Call"
                style={{ color: 'var(--success)' }}
              >
                <Video size={22} />
              </button>
              <button type="button" className={styles.iconBtn} onClick={() => fileInputRef.current.click()} title="Attach File">
                <Paperclip size={22} />
              </button>
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleFileUpload}
              />
              <input 
                type="text" 
                placeholder="Type a message..." 
                className={styles.chatInput}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className={styles.sendBtn}>
                <Send size={20} />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className={`${styles.materialGrid} fade-in`}>
            {messages.filter(m => m.type !== 'text').map(file => (
              <div key={file._id} className={`${styles.materialCard} glass-card`}>
                <div className={styles.fileIcon}>
                  {file.type === 'image' ? <ImageIcon size={32} /> : <FileText size={32} />}
                </div>
                <span className={styles.fileName}>{file.text.replace('Shared a file: ', '')}</span>
                <a href={file.fileUrl} target="_blank" rel="noreferrer" className={styles.link} style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Download</a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="var(--primary)" /> Group Timetable
                </h3>
                <button className="glass" style={{ padding: '4px 12px', fontSize: '0.8rem', borderRadius: '4px' }} onClick={() => navigate('/timetable')}>Add Event</button>
              </div>
              {groupEvents.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No events scheduled for this week.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {groupEvents.map(event => (
                    <div key={event._id} className="glass" style={{ padding: '10px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{event.startTime} - {event.endTime}</span>
                      <h4 style={{ fontSize: '0.9rem' }}>{event.title}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={20} color="var(--warning)" /> Daily Goals
                </h3>
                <button className="glass" style={{ padding: '4px 12px', fontSize: '0.8rem', borderRadius: '4px' }} onClick={() => navigate('/tasks')}>Add Goal</button>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {groupTasks.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No goals set for this group.</p>
                ) : (
                  groupTasks.map(task => (
                    <li key={task._id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={async () => {
                          await updateTask(task._id, { completed: !task.completed });
                          const updated = await getTasks(id);
                          setGroupTasks(updated);
                        }}
                      /> 
                      <span style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                        {task.title}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      {showMeeting && (
        <div className={styles.meetingOverlay}>
          <div className={styles.meetingContainer}>
            <div className={styles.meetingHeader}>
              <h3>{group.name} - Study Meeting</h3>
              <button onClick={() => setShowMeeting(false)} className={styles.closeMeeting}>
                End Meeting
              </button>
            </div>
            <iframe
              src={`https://meet.jit.si/StudySyncMeeting${group.code}#config.prejoinPageEnabled=false&config.startWithAudioMuted=true&config.disableDeepLinking=true`}
              style={{ width: '100%', height: 'calc(100% - 60px)', border: 'none', borderRadius: '0 0 1rem 1rem' }}
              allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; speaker-selection"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
