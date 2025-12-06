import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ChatQuickOptions } from "@/components/ui/chat-quick-options"
import type { ChatOption } from "@/lib/api"

describe("ChatQuickOptions", () => {
  it("returns null when there are no options", () => {
    const { container } = render(<ChatQuickOptions options={[]} onSelect={jest.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it("renders options with default title and calls onSelect", async () => {
    const options: ChatOption[] = [
      { id: "o1", label: "Option 1" },
      { id: "o2", label: "Option 2" },
    ]
    const handleSelect = jest.fn()
    const user = userEvent.setup()

    render(<ChatQuickOptions options={options} onSelect={handleSelect} />)

    expect(
      screen.getByText("気になるテーマを選んでください"),
    ).toBeInTheDocument()

    const optionButton = screen.getByRole("button", { name: "Option 1" })
    await user.click(optionButton)

    expect(handleSelect).toHaveBeenCalledTimes(1)
    expect(handleSelect).toHaveBeenCalledWith(options[0])
  })

  it("disables buttons when disabled prop is true", () => {
    const options: ChatOption[] = [{ id: "o1", label: "Option 1" }]

    render(<ChatQuickOptions options={options} onSelect={jest.fn()} disabled />)

    const optionButton = screen.getByRole("button", { name: "Option 1" })
    expect(optionButton).toBeDisabled()
  })
})

