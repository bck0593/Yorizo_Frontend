import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { Mic, MicOff, RotateCcw } from "lucide-react"

type Status = "idle" | "recording" | "review"

type Props = {
  onTranscript: (text: string) => void
  onStatusChange?: (status: Status, info?: string) => void
  disabled?: boolean
  maxSeconds?: number
  placeholderText?: string
  className?: string
}

export function VoiceInputControls({
  onTranscript,
  onStatusChange,
  disabled = false,
  maxSeconds = 60,
  placeholderText = "（音声入力のモックです。実際の録音は行いません）",
  className,
}: Props) {
  const [status, setStatus] = useState<Status>("idle")
  const [elapsed, setElapsed] = useState(0)
  const [message, setMessage] = useState("")
  const [lastTranscript, setLastTranscript] = useState("")
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const stopRecording = (reason?: string) => {
    stopTimer()
    const mockText =
      lastTranscript && !reason
        ? lastTranscript
        : `${placeholderText} ${reason ? `(${reason})` : ""}`.trim()
    setStatus("review")
    setLastTranscript(mockText)
    setEditText(mockText)
    setMessage(reason ?? "録音を停止しました。")
    onTranscript(mockText)
    onStatusChange?.("review", reason)
  }

  const startRecording = () => {
    if (disabled) return
    setStatus("recording")
    setElapsed(0)
    setMessage("")
    onStatusChange?.("recording")
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1
        if (next >= maxSeconds) {
          stopRecording("1分の上限に達しました。")
        }
        return next
      })
    }, 1000)
  }

  const handleToggle = () => {
    if (status === "recording") {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleEditSave = () => {
    setLastTranscript(editText)
    setEditing(false)
    setMessage("誤認識を修正して反映しました。")
    onTranscript(editText)
    onStatusChange?.("review", "edited")
  }

  const recording = status === "recording"

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          data-testid="voice-toggle"
          className={clsx(
            "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold border transition-colors",
            recording
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : "bg-white border-[var(--yori-outline)] text-[var(--yori-ink-strong)] hover:bg-[var(--yori-secondary)]",
            disabled && "opacity-60 cursor-not-allowed",
          )}
          aria-label={recording ? "録音を停止" : "音声入力"}
        >
          {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {recording ? "録音停止" : "音声入力"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(true)
            setStatus("review")
            setMessage("直前の音声結果を修正できます。")
          }}
          disabled={!lastTranscript || disabled}
          data-testid="voice-review"
          className={clsx(
            "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold border border-[var(--yori-outline)] text-[var(--yori-ink-strong)] bg-white hover:bg-[var(--yori-secondary)]",
            (!lastTranscript || disabled) && "opacity-60 cursor-not-allowed",
          )}
          aria-label="誤認識を修正"
        >
          <RotateCcw className="h-4 w-4" />
          誤認識修正
        </button>
        <div className="text-[11px] text-[var(--yori-ink-soft)] min-w-[120px]">
          {recording ? `録音中… ${elapsed}s / ${maxSeconds}s` : status === "review" ? "録音済み" : "未録音"}
        </div>
      </div>

      {recording && (
        <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          録音中です。1分で自動停止します。
        </div>
      )}

      {editing && (
        <div className="rounded-2xl border border-[var(--yori-outline)] bg-white p-3 space-y-2">
          <p className="text-xs font-semibold text-[var(--yori-ink-strong)]">直前の音声結果を修正</p>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            data-testid="voice-edit"
            className="w-full min-h-[100px] rounded-xl border border-[var(--yori-outline)] bg-[var(--yori-surface-muted)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--yori-tertiary)]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEditSave}
              className="btn-primary px-4 py-2 text-sm font-semibold inline-flex items-center justify-center"
            >
              適用する
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-ghost px-4 py-2 text-sm font-semibold inline-flex items-center justify-center"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {message && <p className="text-[11px] text-[var(--yori-ink-soft)]">{message}</p>}
    </div>
  )
}
