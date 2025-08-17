import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function SongList({ loading, songs, currentIndex, onSelect, onSearch }) {
  return (
    <div className="song-list">
      <div className="search">
        <div className="search-input-wrapper">
          <input placeholder="Search songs, artists..." onChange={e => onSearch(e.target.value)} />
          <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="search-icon" />
        </div>
      </div>

      {loading ? (
        <ul className="list skeleton">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="row">
              <div className="cover shimmer" />
              <div className="meta">
                <div className="line shimmer" />
                <div className="line small shimmer" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="list">
          {songs.map((song, index) => (
            <li
              key={song.id || index}
              className={`row ${index === currentIndex ? 'active' : ''}`}
              onClick={() => onSelect(index)}
            >
              <img className="cover" src={song.coverUrl} alt={`${song.title} cover`} />
              <div className="meta">
                <div className="title">{song.title}</div>
                <div className="artist">{song.artist}</div>
              </div>
              <div className="duration">{formatTime(song.duration)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function formatTime(sec = 0) {
  sec = Math.round(sec || 0)
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
