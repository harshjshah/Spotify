import React, { useEffect, useState } from 'react'
import SongList from './components/SongList.jsx'
import Player from './components/Player.jsx'
import useAudio from './hooks/useAudio.js'
import './styles/app.css'
import logo from '../SpotifyLogo.png'
import profilePic from '../ProfilePic.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faBars } from '@fortawesome/free-solid-svg-icons'

const API_URL = 'https://cms.samespace.com/items/songs'
const COVER_URL = (id) => `https://cms.samespace.com/assets/${id}`

export default function App() {
  const [songs, setSongs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('for-you')
  const [currentSong, setCurrentSong] = useState(null)
  const [listOpen, setListOpen] = useState(true)

  // Duration not returned in the API - setting durations by mapping with Song ID. (Ideally would be fetched from the API call)
  const durations = {
    1: 197,
    2: 141,
    3: 97,
    4: 114,
    7: 55,
    8: 138,
    9: 141,
    10: 179
  }

  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true)
        const res = await fetch(API_URL)
        const data = await res.json()
        const items = data?.data?.map(item => ({
          id: item.id,
          title: item.name,
          artist: item.artist,
          duration: durations[item.id],
          cover: item.cover,
          url: item.url,
          accent: item.accent,
          raw: item
        }))

        const normalized = items.map(i => ({
          ...i,
          coverUrl: i.cover ? COVER_URL(i.cover) : null
        }))

        setSongs(normalized)
        setFiltered(normalized)
        if (!currentSong) {
          setCurrentSong(normalized[0])
          controls.setSrc(normalized[0]?.url, false)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [])

  const { audioState, controls } = useAudio({
    onEnded: () => handleNext()
  })

  useEffect(() => {
    if(currentSong?.accent) {
      document.documentElement.style.setProperty('--accent', currentSong.accent)
    }
  })

  function handleNext() {
    if (!filtered.length) return
    const currentIndex = filtered.findIndex(song => song.id === currentSong?.id)
    const nextIndex = (currentIndex + 1) % filtered.length
    setCurrentSong(filtered[nextIndex])
    controls.setSrc(filtered[nextIndex]?.url, true)
  }

  function handlePrev() {
    if (!filtered.length) return
    const currentIndex = filtered.findIndex(song => song.id === currentSong?.id)
    const prevIndex = (currentIndex - 1 + filtered.length) % filtered.length
    setCurrentSong(filtered[prevIndex])
    controls.setSrc(filtered[prevIndex]?.url, true)
  }

  function onSearch(q) {
    const query = q.toLowerCase()
    const searchResults = songs.filter(song =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    )
    setFiltered(applyTab(searchResults, activeTab))
  }

  function applyTab(list, tab) {
    if (tab === 'top-tracks') {
      const top = list.filter(song => song?.raw?.top_track);
      if (top.length) return top
    }
    return list
  }

  function onTabChange(tab) {
    setActiveTab(tab)
    setFiltered(applyTab(songs, tab))
  }

  function onSelectSong(index) {
    const song = filtered[index]
    setCurrentSong(song)
    controls.setSrc(song.url, true)
  }

  return (
    <div className="app" data-list-open={listOpen}>
      <header className="header">
        <img src={logo} className="logo"/>
        <img src={profilePic} className="profile" />
        {!listOpen && (
          <button className="hamburger-button" onClick={() => setListOpen(v => !v)} aria-label="Open song list"><FontAwesomeIcon icon={faBars} size="lg" /></button>
        )}
      </header>
      <aside className="sidebar">
        <div>
          <button className="close-button" onClick={() => setListOpen(v => !v)} aria-label="Close song list"><FontAwesomeIcon icon={faXmark} size="lg" /></button>
        </div>
        <div className="tabs">
          <button className={activeTab === 'for-you' ? 'active' : ''} onClick={() => onTabChange('for-you')}>For You</button>
          <button className={activeTab === 'top-tracks' ? 'active' : ''} onClick={() => onTabChange('top-tracks')}>Top Tracks</button>
        </div>
        <SongList
          loading={loading}
          songs={filtered}
          currentIndex={filtered?.findIndex(song => song.id === currentSong?.id)}
          onSearch={onSearch}
          onSelect={onSelectSong}
        />
      </aside>
      <main className="player-pane">
        <Player
          song={currentSong}
          audioState={audioState}
          onPlayPause={() => (audioState.playing ? controls.pause() : controls.play())}
          onPrev={handlePrev}
          onNext={handleNext}
          onSeek={controls.seek}
          onVolume={controls.setVolume}
        />
      </main>
    </div>
  )
}
