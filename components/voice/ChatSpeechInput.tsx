"use client"

import { useEffect } from "react"
import clsx from "clsx"
import { Loader2, Mic, Square } from "lucide-react"

import { useChatSpeechRecognition } from "./useChatSpeechRecognition"

type ChatSpeechInputProps = {
  onTranscript: (text: string) => void
  onStatusChange?: (s: "idle" | "recording" | "transcribing") => void
  disabled?: boolean
  className?: string
  "data-testid"?: string
}

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`

export function ChatSpeechInput({
  onTranscript,
  onStatusChange,
  disabled = false,
  className,
  "data-testid": testId,
}: ChatSpeechInputProps) {
  const { status, error, elapsed, start, stop } = useChatSpeechRecognition({ onTranscript, disabled })

  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  return (
    <div
      className={clsx("inline-flex items-center gap-2 text-sm text-[var(--yori-ink-strong)]", className)}
      data-testid={testId ?? "chat-speech-input"}
    >
      <button
        type="button"
        onClick={() => void start()}
        disabled={disabled || status !== "idle"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--yori-outline)] bg-[var(--yori-surface-muted)] text-[var(--yori-ink-strong)] hover:bg-[var(--yori-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="音声入力"
      >
        <Mic className="h-4 w-4" />
      </button>
      {status === "recording" ? (
        <>
          <div className="flex items-center gap-2">
            <div className="flex h-5 items-end gap-[3px]" aria-hidden="true">
              {[8, 12, 16, 12, 10].map((height, idx) => (
                <span
                  key={`${height}-${idx}`}
                  className="w-[6px] rounded-full bg-[var(--yori-primary)] opacity-90 animate-pulse"
                  style={{ height, animationDelay: `${idx * 60}ms` }}
                />
              ))}
            </div>
            <span className="font-mono tabular-nums text-xs font-semibold">{formatTime(elapsed)}</span>
          </div>
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--yori-outline)] bg-[var(--yori-surface-muted)] px-2 py-1 text-xs font-semibold hover:bg-[var(--yori-secondary)]"
            data-testid="chat-voice-stop"
          >
            <Square className="h-3.5 w-3.5" />
            <span>停止</span>
          </button>
        </>
      ) : status === "transcribing" ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>文字起こし中…</span>
        </div>
      ) : (
        <span className="text-xs text-[var(--yori-ink-soft)]">マイクで入力</span>
      )}
      {error && (
        <span className="text-[11px] text-rose-600" data-testid="chat-voice-error">
          {error}
        </span>
      )}
    </div>
  )
}
