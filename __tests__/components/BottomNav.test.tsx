import { render, screen } from "@testing-library/react"

import { BottomNav } from "@/components/BottomNav"

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

describe("BottomNav", () => {
  it("renders tabs for main routes", () => {
    render(<BottomNav />)
    const labels = ["ホーム", "よろず相談", "メモリー", "宿題", "イマココ"]
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })
})
