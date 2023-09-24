import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import RenewSessionOptions from "../RenewSessionOptions/RenewSessionOptions"

const createSubject = () => {
  const onRenewSession = jest.fn();
  const onLogout = jest.fn();

  return {
    onRenewSession,
    onLogout
  }
}

describe("RenewSessionOptions", () => {
  it("should call onRenewSession", () => {
    const { onRenewSession } = createSubject();
    const oneTime = 1;

    render(<RenewSessionOptions onRenewSession={onRenewSession}/>);
    
    const button = screen.getByRole('button', { name: /renew session/i});
    userEvent.click(button);

    expect(onRenewSession).toHaveBeenCalledTimes(oneTime);
  })

  it("should call onLogout", () => {
    const { onLogout } = createSubject();
    const oneTime = 1;

    render(<RenewSessionOptions onLogout={onLogout}/>);
    
    const button = screen.getByRole('button', { name: /logout/i});
    userEvent.click(button);

    expect(onLogout).toHaveBeenCalledTimes(oneTime);
  })
})