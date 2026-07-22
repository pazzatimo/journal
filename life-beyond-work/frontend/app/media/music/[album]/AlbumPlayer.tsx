'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Song {
  _id: string
  title: string
  fileUrl: string | null
  slug: { current: string }
}

export default function AlbumPlayer({ songs }: { songs: Song[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isEndingRef = useRef(false) // Prevent double triggers

  const playableSongs = songs.filter((song: Song) => song.fileUrl)
  const currentSong = playableSongs[currentIndex]

  // Initialize audio element (runs once)
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      audioRef.current.addEventListener('ended', handleEnded)
      audioRef.current.addEventListener('play', () => setIsPlaying(true))
      audioRef.current.addEventListener('pause', () => setIsPlaying(false))
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audioRef.current.removeEventListener('ended', handleEnded)
        audioRef.current.removeEventListener('play', () => setIsPlaying(true))
        audioRef.current.removeEventListener('pause', () => setIsPlaying(false))
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  // Load new song when index changes
  useEffect(() => {
    if (!currentSong || !audioRef.current) return

    const audio = audioRef.current
    audio.src = currentSong.fileUrl!
    audio.load()
    isEndingRef.current = false

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
  }, [currentIndex, currentSong])

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false))
    }
  }, [isPlaying, currentSong])

  // Play a specific song
  const playSong = useCallback((index: number) => {
    if (index === currentIndex && isPlaying) return
    setCurrentIndex(index)
    setIsPlaying(true)
  }, [currentIndex, isPlaying])

  // Next/Previous
  const nextSong = useCallback(() => {
    if (currentIndex < playableSongs.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsPlaying(true)
    } else {
      // End of playlist: stop playing
      setIsPlaying(false)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [currentIndex, playableSongs.length])

  const prevSong = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsPlaying(true)
    }
  }, [currentIndex])

  // Event handlers
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const total = audioRef.current.duration || 0
      setProgress(total ? (current / total) * 100 : 0)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0)
    }
  }, [])

  const handleEnded = useCallback(() => {
    // Prevent double-triggering
    if (isEndingRef.current) return
    isEndingRef.current = true
    nextSong()
  }, [nextSong])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setProgress(val)
    if (audioRef.current) {
      const total = audioRef.current.duration || 0
      audioRef.current.currentTime = (val / 100) * total
    }
  }, [])

  const formatTime = (seconds: number) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // If no playable songs
  if (playableSongs.length === 0) {
    return (
      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', color: '#6b7280', textAlign: 'center' }}>
        No playable songs in this album.
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '1rem 1.5rem', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Now Playing Info */}
        <div style={{ flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Now Playing</div>
          <div style={{ fontWeight: '500', color: '#111827' }}>
            {currentSong ? currentSong.title : 'No song selected'}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
            {currentIndex + 1} / {playableSongs.length}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={prevSong}
            disabled={currentIndex === 0}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === 0 ? 0.5 : 1,
            }}
          >
            ⏮
          </button>

          <button
            onClick={togglePlay}
            style={{
              padding: '0.4rem 1.2rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#111827',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              minWidth: '50px',
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            onClick={nextSong}
            disabled={currentIndex === playableSongs.length - 1}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              cursor: currentIndex === playableSongs.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === playableSongs.length - 1 ? 0.5 : 1,
            }}
          >
            ⏭
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ flex: 1, minWidth: '120px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              style={{ flex: 1, accentColor: '#111827', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}