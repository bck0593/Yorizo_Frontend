import { act } from "react-dom/test-utils"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import WizardPage from "@/app/(yorizo)/wizard/page"

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}))

describe("WizardPage", () => {
  it("moves to next question after selecting a choice", async () => {
    render(<WizardPage />)

    expect(screen.getByText("業種を教えてください")).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "製造" }))

    await waitFor(() => expect(screen.getByText("従業員数はどのくらいですか？")).toBeInTheDocument())
  })

  it("displays the unified thinking row while advancing steps", async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    try {
      render(<WizardPage />)

      await user.click(screen.getByRole("button", { name: "製造" }))

      const thinkingRow = await screen.findByRole("status", { name: /Yorizoが回答を整理しています/ })
      const image = thinkingRow.querySelector('img[aria-hidden="true"]')
      expect(image).toBeTruthy()

      act(() => {
        jest.runOnlyPendingTimers()
      })
    } finally {
      jest.useRealTimers()
    }
  })
})
