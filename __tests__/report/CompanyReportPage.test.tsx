import { render, screen, waitFor } from "@testing-library/react"

import CompanyReportPage from "@/app/(yorizo)/components/report/CompanyReportPage"
import { getCompanyReport, type CompanyReport } from "@/lib/api"

jest.mock("@/lib/api", () => {
  const actual = jest.requireActual("@/lib/api")
  return {
    ...actual,
    getCompanyReport: jest.fn(),
  }
})

jest.mock("@/lib/hooks/useCompanyProfile", () => ({
  useCompanyProfile: () => ({ data: null, isLoading: false }),
}))

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}))

const mockReport: CompanyReport = {
  company: { id: "1", name: "デモ株式会社" },
  radar: { axes: ["売上持続性"], periods: [{ label: "最新", scores: [3], raw_values: [100] }] },
  qualitative: { keieisha: {}, jigyo: {}, kankyo: {}, naibu: {} },
  current_state: "テスト状態",
  future_goal: "",
  action_plan: "",
  snapshot_strengths: [],
  snapshot_weaknesses: [],
  desired_image: "",
  gap_summary: "",
  thinking_questions: [],
}

describe("CompanyReportPage", () => {
  it("renders action links and report shell", async () => {
    ;(getCompanyReport as jest.Mock).mockResolvedValue(mockReport)
    render(<CompanyReportPage />)

    await waitFor(() => expect(getCompanyReport).toHaveBeenCalled())
    expect(screen.getByText("チャットを再開")).toBeInTheDocument()
    expect(screen.getByText("イマココレポート")).toBeInTheDocument()
  })
})
