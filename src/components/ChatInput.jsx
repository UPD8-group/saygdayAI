import { useEffect, useRef, useState } from 'react'

const MAX_BYTES = 6 * 1024 * 1024 // 6 MB — keeps base64 payload sane
const ACCEPTED = /^image\/(jpeg|png|webp|heic|heif|gif)$/i

// Read a File into base64 + media_type. Stays in memory; never written anywhere.
function readImage(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => {
      const result = r.result || ''
      const m = /^data:([^;]+);base64,(.+)$/.exec(result)
      if (!m) return reject(new Error('Could not read image'))
      resolve({
        media_type: m[1],
        data: m[2],
        preview: result, // data URL for the preview thumb
      })
    }
    r.onerror = () => reject(new Error('Could not read image'))
    r.readAsDataURL(file)
  })
}

export default function ChatInput({ onSend, disabled, placeholder }) {
  const [text, setText] = useState('')
  const [pending, setPending] = useState(null) // { media_type, data, preview }
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const taRef = useRef(null)
  const fileRef = useRef(null)
  const cameraRef = useRef(null)

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [text])

  async function handleFiles(fileList) {
    setError('')
    const file = Array.from(fileList || []).find((f) =>
      ACCEPTED.test(f.type || '')
    )
    if (!file) {
      setError('Use a JPG, PNG, WebP or HEIC image.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('Image is too large (max ~6MB).')
      return
    }
    try {
      const img = await readImage(file)
      setPending(img)
    } catch (e) {
      setError(e.message || 'Could not read that image.')
    }
  }

  function onPaste(e) {
    if (disabled) return
    const items = e.clipboardData?.items || []
    for (const item of items) {
      if (item.kind === 'file' && ACCEPTED.test(item.type || '')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) handleFiles([file])
        return
      }
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (disabled) return
    handleFiles(e.dataTransfer?.files)
  }

  function onDragOver(e) {
    e.preventDefault()
    if (!disabled) setDragOver(true)
  }

  function submit() {
    const trimmed = text.trim()
    if (disabled) return
    if (!trimmed && !pending) return
    onSend({ text: trimmed, image: pending || undefined })
    setText('')
    setPending(null)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => setDragOver(false)}
      className={`sticky bottom-0 z-20 border-t bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80 ${
        dragOver ? 'border-amber' : 'border-line'
      }`}
    >
      <div className="mx-auto max-w-3xl px-3 py-3 sm:px-4">
        {error && (
          <p className="mb-2 text-xs text-red-400">{error}</p>
        )}
        {pending && (
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-line bg-line/30 p-2">
            <img
              src={pending.preview}
              alt="Pending listing"
              className="h-14 w-14 rounded-md object-cover"
            />
            <div className="flex-1 text-xs text-muted">
              Image ready. Add a note if you like, then send.
            </div>
            <button
              onClick={() => setPending(null)}
              className="rounded-md border border-line px-2 py-1 text-xs text-muted hover:text-body"
              aria-label="Remove image"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <div className="flex flex-shrink-0 flex-col gap-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={disabled}
              title="Attach screenshot"
              aria-label="Attach image"
              className="rounded-xl border border-line bg-line/40 p-2 text-muted transition hover:text-amber disabled:opacity-40"
            >
              <PaperclipIcon />
            </button>
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              disabled={disabled}
              title="Take photo"
              aria-label="Take a photo with your camera"
              className="rounded-xl border border-line bg-line/40 p-2 text-muted transition hover:text-amber disabled:opacity-40 sm:hidden"
            >
              <CameraIcon />
            </button>
          </div>

          <textarea
            ref={taRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder={placeholder || 'Tell Frank about the listing…'}
            disabled={disabled}
            className="flex-1 resize-none rounded-2xl border border-line bg-line/40 px-4 py-3 text-[15px] text-body placeholder:text-muted focus:border-amber focus:outline-none disabled:opacity-50"
          />

          <button
            onClick={submit}
            disabled={disabled || (!text.trim() && !pending)}
            className="rounded-2xl bg-amber px-4 py-3 font-semibold text-ink transition hover:bg-amber-dim disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
        <p className="mt-1 hidden text-[11px] text-muted sm:block">
          Paste a screenshot, drag one in, or tap the clip. Listings stay in memory only.
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

function PaperclipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}
