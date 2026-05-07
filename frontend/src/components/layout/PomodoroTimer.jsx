import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import styles from './PomodoroTimer.module.css';

const PomodoroTimer = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
      // Simple beep sound or alert
      alert(isBreak ? 'Break is over! Time to study.' : 'Study session complete! Take a break.');
      if (!isBreak) {
        setIsBreak(true);
        setSeconds(5 * 60);
      } else {
        setIsBreak(false);
        setSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, isBreak]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsActive(false);
    setIsBreak(false);
    setSeconds(25 * 60);
  };

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerTitle}>
        {isBreak ? <><Coffee size={12} /> Short Break</> : 'Study Focus'}
      </div>
      <div className={styles.timeDisplay}>{formatTime(seconds)}</div>
      <div className={styles.controls}>
        <button className={styles.btn} onClick={() => setIsActive(!isActive)}>
          {isActive ? <Pause size={14} /> : <Play size={14} />}
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className={`${styles.btn} ${styles.btnReset}`} onClick={reset}>
          <RotateCcw size={14} />
        </button>
      </div>
      <div 
        className={styles.progress} 
        style={{ width: `${(seconds / (isBreak ? 5*60 : 25*60)) * 100}%` }}
      ></div>
    </div>
  );
};

export default PomodoroTimer;
