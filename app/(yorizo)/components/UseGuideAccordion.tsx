"use client"

import { Fragment, useState } from "react"
import { ChevronDown, CircleHelp, NotebookPen } from "lucide-react"

import { YoriCard } from "@/components/YoriCard"
import { YorizoAvatar } from "@/components/YorizoAvatar"

const CONNECTOR_COLOR = "#C8CDD5"

const STEP_ITEMS = [
  {
    title: "Yorizoと話す",
    description: "モヤモヤを言葉にして整理の糸口を見つける。",
  },
  {
    title: "イマココレポート",
    description: "これまでのチャットとデータをまとめて俯瞰し、次の一歩を確認。",
  },
  {
    title: "相談メモ",
    description: "専門家に渡せる 1 枚メモとして要点を残す。",
  },
]

function StepConnector() {
  return (
    <span
      aria-hidden
      data-testid="home-step-connector"
      data-mobile-orientation="down"
      className="block h-0 w-0 rotate-90 md:rotate-0 border-y-[7px] border-y-transparent border-l-[14px] flex-shrink-0 self-center"
      style={{ borderLeftColor: CONNECTOR_COLOR }}
    />
  )
}

export function UseGuideAccordion() {
  const [open, setOpen] = useState(false)

  return (
    <section className="yori-card p-5 md:p-6 space-y-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl border border-[var(--yori-outline)] bg-[var(--yori-surface)] px-4 py-3 text-left transition hover:border-[var(--yori-tertiary)]"
        aria-expanded={open}
        aria-controls="use-guide-content"
      >
        <div className="flex items-center gap-3">
          <CircleHelp className="h-5 w-5 text-[var(--yori-ink-strong)]" aria-hidden />
          <span className="text-base font-semibold text-[var(--yori-ink-strong)]">Yorizoの使い方</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-[var(--yori-ink-soft)] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div id="use-guide-content" className="space-y-5">
          <div className="flex flex-col items-center text-center gap-3">
            <YorizoAvatar size="lg" />
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--yori-ink-strong)]">
                Yorizoと話して「いま」を見直し、次の一歩へ
              </h2>
              <p className="text-sm text-[var(--yori-ink)] leading-relaxed">
                話す → イマココレポートで俯瞰 → 相談メモで人に渡せる形にまとめる。3 ステップで頭と気持ちを整える。
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-4">
            {STEP_ITEMS.map((item, index) => (
              <Fragment key={item.title}>
                <YoriCard
                  variant="info"
                  title={item.title}
                  description={item.description}
                  className="flex-1 w-full"
                />
                {index < STEP_ITEMS.length - 1 && <StepConnector />}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
