import { render, screen } from "@testing-library/react"
import Snackbar from "../Snackbar/Snackbar"

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

const createSubject = () => {
  const message = "Fake message"
  const durationInMilliseconds = 1000;

  return {
    message,
    durationInMilliseconds
  }
}

describe("Snackbar", () => {
  it("should render message", () => {
    const { message } = createSubject();

    render(<Snackbar message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  })

  it("should handle setTimeout correctly", async () => {
    const { message, durationInMilliseconds } = createSubject();

    render(<Snackbar message={message} durationInMilliseconds={durationInMilliseconds} />);

    expect(setTimeout).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), durationInMilliseconds);
  })
})