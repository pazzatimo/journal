'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config' // ← updated path

export default function StudioPage() {
  return <NextStudio config={config} />
}