import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const tracks = [
  {
    id: 1,
    title: 'Lofi Study Beats',
    artist: 'Instrumental Hip Hop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
  },
  {
    id: 2,
    title: 'Deep Concentration',
    artist: 'Ambient White Noise',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder
  },
  {
    id: 3,
    title: 'Piano Serenity',
    artist: 'Classical Focus',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder
  }
];

const FocusMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
  }, [currentTrackIndex]);

  return (
    <section className="glass-card" style={{ marginTop: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Focus Music</h2>
        <Music size={20} color="var(--primary)" />
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
      />

      <div className="glass" style={{ padding: '15px', borderRadius: '12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{currentTrack.title}</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{currentTrack.artist}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
          <button className="icon-btn" onClick={prevTrack} style={{ color: 'var(--text-secondary)' }}>
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay}
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px var(--primary-glow)'
            }}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />}
          </button>
          <button className="icon-btn" onClick={nextTrack} style={{ color: 'var(--text-secondary)' }}>
            <SkipForward size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            style={{ 
              flex: 1, 
              height: '4px', 
              borderRadius: '2px', 
              accentColor: 'var(--primary)',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tracks.map((track, index) => (
          <div 
            key={track.id} 
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: currentTrackIndex === index ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              border: currentTrackIndex === index ? '1px solid var(--primary)' : '1px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: currentTrackIndex === index ? 'var(--primary)' : 'var(--text-primary)' }}>{track.title}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{track.artist}</p>
            </div>
            {currentTrackIndex === index && isPlaying ? (
              <div className="music-bars">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </div>
            ) : (
              <Play size={14} color="var(--text-secondary)" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FocusMusic;
