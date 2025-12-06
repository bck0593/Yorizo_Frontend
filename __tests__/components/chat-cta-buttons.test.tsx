import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ChatCTAButtons } from "@/components/ui/chat-cta-buttons"
import type { ChatCTAButton } from "@/lib/api"

describe("ChatCTAButtons", () => {
  it("returns null when there are no buttons", () => {
    const { container } = render(<ChatCTAButtons buttons={[]} onSelect={jest.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it("renders buttons and calls onSelect when clicked", async () => {
    const buttons: ChatCTAButton[] = [
      { id: "b1", label: "A", action: "go_a" },
      { id: "b2", label: "B", action: "go_b" },
    ]
    const handleSelect = jest.fn()
    const user = userEvent.setup()

    render(<ChatCTAButtons buttons={buttons} onSelect={handleSelect} />)

    const buttonA = screen.getByRole("button", { name: "A" })
    expect(buttonA).toBeInTheDocument()

    await user.click(buttonA)

    expect(handleSelect).toHaveBeenCalledTimes(1)
    expect(handleSelect).toHaveBeenCalledWith(buttons[0])
  })
})

