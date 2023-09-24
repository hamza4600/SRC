import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Modal from '../Modal/Modal'

const createSubject = () => {
  const title = "Fake title"
  const body = <h1>Test</h1>
  const show = true;
  const handleClose = jest.fn();

  return {
    title,
    body,
    show,
    handleClose
  }
}

describe("Modal", () => {
  it("should render title and body", () => {
    const { title, body, show } = createSubject();

    render(<Modal title={title} body={body} show={show}/>);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /test/i})).toBeInTheDocument();
  })

  it("should handle close event", () => {
    const { title, body, show, handleClose } = createSubject();

    render(<Modal title={title} body={body} show={show} handleClose={handleClose} />);

    const button = screen.getByRole("button", { name: /close/i})
    userEvent.click(button)

    expect(handleClose).toHaveBeenCalled()
  })
})