import { render, screen } from "@testing-library/react"

import { YorizoAvatar } from "@/components/YorizoAvatar"

describe("YorizoAvatar", () => {
  it("renders the mascot image without outer frame", () => {
    render(<YorizoAvatar mood="thinking" size="sm" alt="Yorizo thinking" />)

    const img = screen.getByAltText("Yorizo thinking") as HTMLImageElement

    expect(img).toBeInTheDocument()
    expect(img.tagName).toBe("IMG")
    expect(img.getAttribute("src") ?? "").toContain("yorizo_thinking.png")
    expect(img.className).not.toContain("rounded-full")
    expect(img.className).not.toContain("bg-[var(--yori-secondary)]")
    expect(img.className).not.toContain("border")
  })
})
