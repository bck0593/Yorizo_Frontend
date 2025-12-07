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

    expect(screen.getByText(/業種を教えてください/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "製造" }))

    await waitFor(() => expect(screen.getByText(/従業員数はどのくらいですか/)).toBeInTheDocument())
  })
})
