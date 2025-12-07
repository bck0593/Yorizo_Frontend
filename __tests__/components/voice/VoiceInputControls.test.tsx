import { act, fireEvent, render, screen } from "@testing-library/react"

import { VoiceInputControls } from "@/components/voice/VoiceInputControls"

jest.useFakeTimers()

describe("VoiceInputControls", () => {
  it("starts and stops recording and emits transcript", () => {
    const onTranscript = jest.fn()
    render(<VoiceInputControls onTranscript={onTranscript} />)

    fireEvent.click(screen.getByTestId("voice-toggle"))
    expect(screen.getAllByText(/録音中/).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByTestId("voice-toggle"))
    expect(onTranscript).toHaveBeenCalled()
  })

  it("auto stops at maxSeconds", () => {
    const onTranscript = jest.fn()
    render(<VoiceInputControls onTranscript={onTranscript} maxSeconds={2} />)

    fireEvent.click(screen.getByTestId("voice-toggle"))
    act(() => {
      jest.advanceTimersByTime(2100)
    })

    expect(onTranscript).toHaveBeenCalled()
  })

  it("opens correction editor", () => {
    const onTranscript = jest.fn()
    render(<VoiceInputControls onTranscript={onTranscript} />)

    fireEvent.click(screen.getByTestId("voice-toggle"))
    fireEvent.click(screen.getByTestId("voice-toggle"))

    const reviewButton = screen.getByTestId("voice-review")
    expect(reviewButton).not.toBeDisabled()
    fireEvent.click(reviewButton)

    const editor = screen.getByTestId("voice-edit")
    expect(editor).toBeInTheDocument()
  })
})
