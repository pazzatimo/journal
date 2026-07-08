'use client'

import React from 'react'

export function LikeButton({ initialLikes, id, type }: { initialLikes: number; id: string; type: string }) {
  const [likes, setLikes] = React.useState(initialLikes)
  const [liked, setLiked] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleLike = async () => {
    if (liked || loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/like/${type}/${id}`, { method: 'POST' })
      const data = await res.json()
      if (data.likes) {
        setLikes(data.likes)
        setLiked(true)
      }
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      style={{
        background: 'none',
        border: 'none',
        cursor: liked ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        color: liked ? '#ef4444' : '#6b7280',
        fontSize: '0.875rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.375rem',
        backgroundColor: liked ? '#fef2f2' : 'transparent',
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{liked ? '❤️' : '🤍'}</span>
      <span>{likes}</span>
    </button>
  )
}