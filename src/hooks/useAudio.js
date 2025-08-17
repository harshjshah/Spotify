import { useEffect, useRef, useState } from 'react'

export default function useAudio({ onEnded } = {}) {
  const audioRef = useRef(null)
  const [state, setState] = useState({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1
  })

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio
    const onPlay = () => setState(s => ({ ...s, playing: true }))
    const onPause = () => setState(s => ({ ...s, playing: false }))
    const onTime = () => setState(s => ({ ...s, currentTime: audio.currentTime }))
    const onMeta = () => setState(s => ({ ...s, duration: audio.duration }))
    const onEnd = () => { onEnded && onEnded() }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeAttribute('src')
      audio.load()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  const controls = {
    play: () => audioRef.current.play(),
    pause: () => audioRef.current.pause(),
    seek: (t) => { audioRef.current.currentTime = t },
    setSrc: (url, shouldPlay = false) => {      
      if (!audioRef.current || !url) return
      const audio = audioRef.current
      audio.src = url
      audio.load()
      if (shouldPlay) audio.play().catch(() => { })
    },
    setVolume: (volume) => {
      if (audioRef.current) {
        audioRef.current.volume = volume
        setState(s => ({ ...s, volume }))
      }
    }
  }

  return { audioState: state, controls }
}
