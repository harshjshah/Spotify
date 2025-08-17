import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faBackward, faForward, faPause, faVolumeUp, faVolumeMute, faEllipsis } from '@fortawesome/free-solid-svg-icons'

export default function Player({ song, audioState, onPlayPause, onPrev, onNext, onSeek, onVolume }) {

  const progressPercent = audioState.duration > 0 ? (audioState.currentTime / audioState.duration) * 100 : 0;
  const volumePercent = audioState.volume * 100;

  return (
    <div className="player">
      <div className="art-and-meta">
        <div className="meta">
          <div className="title">{song?.title}</div>
          <div className="artist">{song?.artist || ''}</div>
        </div>
        {song?.coverUrl ? <img className="art" src={song.coverUrl} alt="cover" /> : <div className="art placeholder" />}
      </div>

      <div className="controls">
        <div className="time start-time">{formatTime(audioState.currentTime)}</div>
        <input
          type="range"
          min={0}
          max={Math.max(audioState.duration || 0, 0.0001)}
          value={Math.min(audioState.currentTime, audioState.duration || 0)}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          style={{ background: `linear-gradient(to right, white ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)` }}
        />
        <div className="time end-time">{formatTime(audioState.duration)}</div>
      </div>

      <div className="control-buttons">
        <div>
          <button aria-label="Info"><FontAwesomeIcon icon={faEllipsis} size="lg" /></button>
        </div>
        <div className="music-controls">
          <button onClick={onPrev} aria-label="Previous"><FontAwesomeIcon icon={faBackward} size="lg" /></button>
          <button className="play" onClick={onPlayPause} aria-label="Play/Pause">
            {audioState.playing ? <FontAwesomeIcon icon={faPause} size="lg" /> : <FontAwesomeIcon icon={faPlay} size="lg" />}
          </button>
          <button onClick={onNext} aria-label="Next"><FontAwesomeIcon icon={faForward} size="lg" /></button>
        </div>
        <div className="volume-control">
          <button className="volume" onClick={() => onVolume(audioState.volume > 0 ? 0 : 1)} aria-label="Mute/Unmute">
            <FontAwesomeIcon icon={audioState.volume > 0 ? faVolumeUp : faVolumeMute} size="lg" />
          </button>
          <div className="volume-slider">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={audioState.volume}
              onChange={(e) => onVolume(parseFloat(e.target.value))}
              style={{ background: `linear-gradient(to right, white ${volumePercent}%, rgba(255,255,255,0.2) ${volumePercent}%)` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function formatTime(sec = 0) {
  if (!isFinite(sec)) return '00:00'
  sec = Math.round(sec || 0)
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
