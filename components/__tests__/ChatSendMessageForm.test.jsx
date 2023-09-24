import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatSendMessageForm from "components/ChatSendMessageForm/ChatSendMessageForm"
import { WSProvider } from '../../providers/WSProvider';


const dispatch = jest.fn()
const state = {}

describe('ChatSendMessageForm', () => {
  it("should submit message", () => {
    const oneTime = 1;
    const onSubmit = jest.fn();

    render(
      <WSProvider value={[state, dispatch]}>
        <ChatSendMessageForm onSubmit={onSubmit} />
      </WSProvider>
    )

    const input = screen.getByPlaceholderText("Type your message and hit ENTER")
    userEvent.type(input, "abc{enter}")

    expect(onSubmit).toHaveBeenCalledTimes(oneTime);
  })
})