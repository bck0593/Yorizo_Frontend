import { render, screen } from "@testing-library/react"

import { ThinkingRow } from "@/components/ThinkingRow"

describe("ThinkingRow", () => {
  it("shows spinner, text, and decorative thinking image", () => {
    render(<ThinkingRow text="考え中です" />)

    const status = screen.getByRole("status")
    expect(status).toHaveAttribute("aria-label", "考え中です")
    expect(status).toHaveAttribute("aria-live", "polite")
    expect(screen.getByText("考え中です")).toBeInTheDocument()

    const spinnerClass = status.querySelector("svg")?.getAttribute("class") ?? ""
    expect(spinnerClass).toContain("animate-spin")

    const image = status.querySelector('img[aria-hidden="true"]')
    expect(image).toBeTruthy()
    expect(image?.getAttribute("alt")).toBe("")
  })

  it("renders without text when not provided", () => {
    const { container } = render(<ThinkingRow />)

    expect(container.textContent).toBe("")
    const spinner = container.querySelector("svg")
    expect(spinner).toBeTruthy()
  })
})
