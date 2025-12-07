import type { ReactNode } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import clsx from "clsx"

type Props = {
  text?: ReactNode
  className?: string
  gap?: "default" | "compact"
}

export function ThinkingRow({ text, className, gap = "default" }: Props) {
  const gapClass = gap === "compact" ? "gap-2" : "gap-2 sm:gap-3"
  const label = typeof text === "string" ? text : undefined

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={clsx("inline-flex items-center text-sm text-[var(--yori-ink-soft)]", gapClass, className)}
    >
      <Loader2 aria-hidden className="h-4 w-4 text-[var(--yori-ink-strong)] animate-spin" />
      {text ? <span className="leading-tight">{text}</span> : null}
      <Image
        src="/yorizo/thinking.png"
        alt=""
        aria-hidden
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
    </div>
  )
}
