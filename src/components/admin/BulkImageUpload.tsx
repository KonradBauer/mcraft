'use client'

import { useField } from '@payloadcms/ui'
import { useRef, useState } from 'react'

type ImageRow = { image: string; alt?: string; id?: string }

export default function BulkImageUpload() {
  const { value, setValue } = useField<ImageRow[]>({ path: 'images' })
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(0)
  const [total, setTotal] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    setUploading(true)
    setDone(0)
    setTotal(files.length)

    const existing: ImageRow[] = Array.isArray(value) ? [...value] : []

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])

      try {
        const res = await fetch('/api/media', { method: 'POST', body: formData })
        if (res.ok) {
          const data = await res.json()
          existing.push({ image: data.doc.id, alt: '' })
        }
      } catch {
        // skip failed uploads
      }

      setDone(i + 1)
    }

    setValue(existing)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files) }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: uploading ? 'var(--theme-elevation-100)' : '#4f9a8c',
          color: uploading ? 'var(--theme-text)' : '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          transition: 'background 0.15s',
        }}
      >
        {uploading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
            Wgrywanie {done}/{total}...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Wgraj zdjęcia (bulk)
          </>
        )}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
