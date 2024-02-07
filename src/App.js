// App.js
import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(savedPlaylist);

    const lastPlayedIndex = parseInt(localStorage.getItem('lastPlayedIndex'), 10) || 0;
    setCurrentTrackIndex(lastPlayedIndex);
  }, []);

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    localStorage.setItem('lastPlayedIndex', currentTrackIndex);
  }, [currentTrackIndex]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newPlaylist = Array.from(files).map((file) => URL.createObjectURL(file));
    setPlaylist(newPlaylist);
    setCurrentTrackIndex(0);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackEnd = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} multiple />
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex]}
        onEnded={handleTrackEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div>
        <h2>Playlist</h2>
        <ul>
          {playlist.map((track, index) => (
            <li key={index} onClick={() => setCurrentTrackIndex(index)}>
              {index === currentTrackIndex ? <strong>{track}</strong> : track}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Now Playing</h2>
        <p>{playlist[currentTrackIndex]}</p>
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
    </div>
  );
};

export default App;
