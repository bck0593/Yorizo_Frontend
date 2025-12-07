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
    name: "テスト専門家",
    title: "中小企業診断士",
    organization: "よろず拠点",
    tags: ["売上", "資金繰り"],
    rating: 4.5,
    review_count: 10,
  },
]

describe("Yorozu page", () => {
  it("shows action cards and expert list", async () => {
    ;(getExperts as jest.Mock).mockResolvedValue(experts)
    render(<YorozuExpertsPage />)

    await waitFor(() => expect(screen.getByText("テスト専門家")).toBeInTheDocument())
    expect(screen.getByText("チャットで相談")).toBeInTheDocument()
  })
})
