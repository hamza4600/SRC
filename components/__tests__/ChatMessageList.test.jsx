import { screen, render } from "@testing-library/react"
import { messageListMock } from "../../mocks/message-list/message-list-mock"
import ChatMessageList from "../ChatMessageList/ChatMessageList"
import {WSProvider} from '../../providers/WSProvider'

const dispatch = jest.fn()
const state = {}

describe('ChatMessageList', () => {
  it("should render messages correctly", () => {
    render(
      <WSProvider value={[state, dispatch]}>
        <ChatMessageList messages={messageListMock} />
      </WSProvider>
    );

    const firstMessage = screen.getByText(messageListMock[0].text);
    const secondMessage = screen.getByText(messageListMock[1].text);

    expect(firstMessage).toBeInTheDocument();
    expect(secondMessage).toBeInTheDocument();
  })
})