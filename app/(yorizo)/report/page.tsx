"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight, Loader2, RefreshCcw } from "lucide-react"
import { getCompanyAnalysisReport, type CompanyAnalysisReport, type LocalBenchmarkAxis } from "@/lib/api"
import { useCompanyProfile } from "@/lib/hooks/useCompanyProfile"
import { CompanyInfoSummaryCard } from "@/components/company/CompanyInfoSummaryCard"

const USER_ID = "demo-user"

function RadarChart({ axes }: { axes: LocalBenchmarkAxis[] }) {
  if (!axes?.length) return null

  const size = 260
  const center = size / 2
  const radius = center - 24
  const angleStep = (2 * Math.PI) / axes.length
  const levels = 4

  const pointFor = (score: number, index: number) => {
    const clamped = Math.max(0, Math.min(100, score || 0))
    const r = (clamped / 100) * radius
    const angle = -Math.PI / 2 + index * angleStep
    const x = center + r * Math.cos(angle)
    const y = center + r * Math.sin(angle)
    return `${x},${y}`
  }

  const polygonPoints = axes.map((axis, index) => pointFor(axis.score ?? 0, index)).join(" ")

  const gridLevels = Array.from({ length: levels }, (_, i) => (i + 1) / levels)

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g stroke="rgba(61, 76, 104, 0.15)" strokeWidth={1} fill="none">
          {gridLevels.map((level) => {
            const points = axes
              .map((_, index) => {
                const value = level * 100
                return pointFor(value, index)
              })
              .join(" ")
            return <polygon key={level} points={points} />
          })}
        </g>
        <polygon points={polygonPoints} fill="rgba(79, 93, 154, 0.2)" stroke="rgba(79, 93, 154, 0.7)" strokeWidth={2} />
        {axes.map((axis, index) => {
          const angle = -Math.PI / 2 + index * angleStep
          const labelRadius = radius + 14
          const x = center + labelRadius * Math.cos(angle)
          const y = center + labelRadius * Math.sin(angle)
          return (
            <g key={axis.id}>
              <line
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(angle)}
                y2={center + radius * Math.sin(angle)}
                stroke="rgba(61, 76, 104, 0.2)"
                strokeWidth={1}
              />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-[var(--yori-ink-strong)]">
                {axis.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function CompanyAnalysisReportPage() {
  const router = useRouter()
  const { data: profile, isLoading: loadingProfile } = useCompanyProfile(USER_ID)
  const [report, setReport] = useState<CompanyAnalysisReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCompanyAnalysisReport(USER_ID)
      setReport(data)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "企業分析レポートを取得できませんでした。")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  const formattedUpdatedAt = report?.last_updated_at
    ? new Date(report.last_updated_at).toLocaleString("ja-JP", { hour12: false })
    : "未取得"

  const benchmarkAxes = report?.local_benchmark?.axes ?? []

  return (
    <div className="flex flex-col gap-6">
      <header className="yori-card-muted p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/memory")}
            className="inline-flex items-center gap-2 text-sm text-[var(--yori-ink)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Yorizoの記憶に戻る
          </button>
          <button
            type="button"
            onClick={fetchReport}
            disabled={isLoading}
            className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            レポートを更新
          </button>
        </div>
        <div>
          <p className="text-xs text-[var(--yori-ink-soft)]">最終更新: {formattedUpdatedAt}</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--yori-ink-strong)]">企業分析レポート</h1>
          <p className="mt-2 text-sm text-[var(--yori-ink)] leading-relaxed">
            チャットの内容や登録情報、添付資料などをもとに、現在の経営状況を整理したレポートです。
          </p>
        </div>
      </header>

      {benchmarkAxes.length > 0 && report && (
        <section className="yori-card p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">企業のバランス（ローカルベンチマーク）</p>
            <p className="text-xs text-[var(--yori-ink-soft)]">6つの観点からバランスを可視化しています。</p>
          </div>
          <RadarChart axes={benchmarkAxes} />
          <div className="grid gap-2 sm:grid-cols-2">
            {benchmarkAxes.map((axis) => (
              <div key={axis.id} className="flex items-center justify-between rounded-xl border border-[var(--yori-outline)] bg-white/80 px-3 py-2">
                <p className="text-sm text-[var(--yori-ink-strong)]">{axis.label}</p>
                <span className="text-sm font-semibold text-[var(--yori-ink)]">{axis.score}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <CompanyInfoSummaryCard profile={profile} loading={loadingProfile} onEdit={() => router.push("/company")} />

      {error && <p className="text-sm text-rose-500">{error}</p>}
      {isLoading && (
        <div className="yori-card p-5 text-sm text-[var(--yori-ink-soft)] flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          レポートを生成中です…
        </div>
      )}

      {report && !isLoading && (
        <>
          <section className="yori-card p-5 space-y-2">
            <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">今回の整理サマリー</p>
            <p className="text-sm text-[var(--yori-ink)] leading-relaxed">{report.summary}</p>
          </section>

          <section className="yori-card p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">会社の基本情報</p>
            </div>
            <p className="text-xs text-[var(--yori-ink-soft)]">相談の前提となる会社の概要です。</p>
            <p className="text-sm text-[var(--yori-ink)] leading-relaxed">{report.basic_info_note}</p>
          </section>

          <section className="yori-card p-5 space-y-3">
            <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">財務・経営の状態</p>
            <div className="space-y-3">
              {(report.finance_scores ?? []).map((score) => (
                <div
                  key={score.label}
                  className="flex flex-col gap-2 rounded-2xl border border-[var(--yori-outline)] bg-white/80 px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">{score.label}</p>
                    <p className="text-sm text-[var(--yori-ink)] leading-snug">{score.description}</p>
                  </div>
                  <span className="inline-flex items-center justify-center rounded-full bg-[var(--yori-secondary)] px-3 py-1 text-sm font-semibold text-[var(--yori-ink-strong)]">
                    {score.score ?? "-"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="yori-card p-5 space-y-3">
            <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">チャットから読み取れる経営課題</p>
            <p className="text-xs text-[var(--yori-ink-soft)]">これまでの相談内容から整理した主なモヤモヤです。</p>
            <div className="space-y-3">
              {(report.pain_points ?? []).map((group) => (
                <div key={group.category}>
                  <p className="text-xs font-semibold text-[var(--yori-ink-soft)]">{group.category}</p>
                  <ul className="list-disc list-inside text-sm text-[var(--yori-ink)] space-y-1">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="yori-card p-5 space-y-3">
            <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">強み・弱み（ローカルベンチマークの観点）</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="yori-card bg-[var(--yori-surface-muted)] border border-[var(--yori-outline)] p-4 space-y-2">
                <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">強み</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-[var(--yori-ink)]">
                  {(report.strengths ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="yori-card bg-[var(--yori-surface-muted)] border border-[var(--yori-outline)] p-4 space-y-2">
                <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">弱み</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-[var(--yori-ink)]">
                  {(report.weaknesses ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="yori-card p-5 space-y-3">
            <p className="text-sm font-semibold text-[var(--yori-ink-strong)]">今後3〜6か月のアクション候補</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-[var(--yori-ink)]">
              {(report.action_items ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => router.push("/yorozu")}
              className="btn-primary w-full px-4 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2"
            >
              よろず支援拠点への相談を検討する
              <ChevronRight className="h-4 w-4" />
            </button>
          </section>
        </>
      )}

      {!report && !isLoading && !error && (
        <div className="yori-card p-5 text-sm text-[var(--yori-ink-soft)]">
          企業分析レポートはまだ生成されていません。レポートを更新ボタンを押して取得してください。
        </div>
      )}

      <div className="text-center text-xs text-[var(--yori-ink-soft)] pb-6">
        <button
          type="button"
          onClick={fetchReport}
          className="inline-flex items-center gap-1 text-[var(--yori-ink-strong)] font-semibold"
        >
          最新の情報に更新
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
