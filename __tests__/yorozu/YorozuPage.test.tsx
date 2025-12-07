import { render, screen, waitFor } from "@testing-library/react"

import YorozuExpertsPage from "@/app/(yorizo)/yorozu/page"
import { getExperts } from "@/lib/api"

jest.mock("@/lib/api", () => {
  const actual = jest.requireActual("@/lib/api")
  return {
    ...actual,
    getExperts: jest.fn(),
  }
})

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
}))

const experts = [
  {
    id: "1",
    name: "山田 太郎",
    title: "中小企業診断士",
    organization: "東京よろず支援拠点",
    tags: ["売上", "資金繰り"],
    rating: 4.5,
    review_count: 10,
  },
]

describe("Yorozu page", () => {
  it("shows action cards and expert list", async () => {
    ;(getExperts as jest.Mock).mockResolvedValue(experts)
    render(<YorozuExpertsPage />)

    await waitFor(() => expect(screen.getByText("山田 太郎")).toBeInTheDocument())
    expect(screen.getByRole("link", { name: "チャットで相談" })).toHaveAttribute("href", "/chat")
    expect(screen.getByRole("link", { name: /イマココレポートを見る/ })).toHaveAttribute("href", "/report")
    expect(screen.getByRole("link", { name: "専門家に予約する" }).getAttribute("href")).toContain("/yorozu/experts/1/schedule")
  })
})
