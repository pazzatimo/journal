'use client'

import Giscus from '@giscus/react'

export function Comments({ id, title, url }: { id: string; title?: string; url?: string }) {
  return (
    <Giscus
      id={`comments-${id}`}
      repo="pazzatimo/journal"
      repoId="R_kgDOTNwN_w"
      category="Announcements"
      categoryId="DIC_kwDOTNwN_84DAj1f"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="en"
      loading="lazy"
    />
  )
}