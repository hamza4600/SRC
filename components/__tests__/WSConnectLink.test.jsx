import WSConnectLink from "../WSConnectLink/WSConnectLink";
import { WSProvider, wsStatus } from "../../providers/WSProvider";
import { screen, render } from "@testing-library/react";
import ShowroomProvider from "../../providers/ShowroomProvider/ShowroomProvider";
import { showroomStatusOptions } from "../../providers/ShowroomProvider/ShowroomStatusOptions";
import userEvent from "@testing-library/user-event";
import { chatStatus } from "../../constants/chatStatusOptions";

const renderWsConnect = (wsContext, showroomContext ) => {
    return render(
        <ShowroomProvider initContext={showroomContext} >
            <WSProvider initContext={wsContext} >
                <WSConnectLink />
            </WSProvider>
        </ShowroomProvider>
    );
}

describe('WSConnectLink', () => {
    it('should render correctly when ws is disconnected and showroom not loaded', () => {
        const wsState = {
            status: wsStatus.disconnected,
        }
        const showroomState = {
            status: showroomStatusOptions.notLoaded,
        }

        renderWsConnect(wsState ,showroomState)
        const heading = screen.getByRole('heading', { name: /chat \(disconnected\)/i })
    
        expect(heading).toBeInTheDocument(); 
    });

     it('should render correctly when ws is disconnected and showroom loaded', () => {
        const wsState = {
            status: wsStatus.disconnected,
        }
        const showroomState = {
            status: showroomStatusOptions.dataLoaded,
            apiData: {
                staticShowrooms: {
                    defaultRoom: "id1",
                    "id1": {
                        "path": "some-path",
                        "label": "Some Room"
                    }
                }
            }
        }
        renderWsConnect(wsState, showroomState)
        const connectButton = screen.getByRole('button', { name: /connect to chat/i })
        expect(connectButton).toBeInTheDocument()
        
        const heading = screen.getByRole('heading', { name: /chat \(disconnected\)/i })
        expect(heading).toBeInTheDocument(); 
    });

    it('should behave and render correctly when chat connected and closed ', () => {
        const wsState = {
            status: wsStatus.connected,
            chatStatus: chatStatus.closed,
            ws: {
                send: jest.fn()
            }
        }
        const showroomState = {
            state: showroomStatusOptions.dataLoaded,
            apiData: {
                staticShowrooms: {
                    defaultRoom: "id1",
                    "id1": {
                        "path": "some-path",
                        "label": "Some Room"
                    }
                }
            }
        }

        renderWsConnect(wsState, showroomState)

        const connectedHeader = screen.getByRole('heading', { name: /chat \(connected\)/i })
        expect(connectedHeader).toBeInTheDocument()

        const openChatButton = screen.getByRole('button', { name: /open chat/i })
        expect(openChatButton).toBeInTheDocument()
        userEvent.click(openChatButton)

        const closeChatButton = screen.getByRole('button', { name: /close chat/i })
        expect(closeChatButton).toBeInTheDocument()

        const disconnectButton = screen.getByRole('button', { name: /disconnect to chat/i })
        expect(disconnectButton).toBeInTheDocument()

        userEvent.click(disconnectButton)

        const disconnectedHeader = screen.getByRole('heading', { name: /chat \(disconnected\)/i })
        expect(disconnectedHeader).toBeInTheDocument()
    })

    it('should render correct chat option when chat is connected and opened', () => {
        const wsState = {
            status: wsStatus.connected,
            chatStatus: 'OPEN'
        }
        const showroomState = {
            state: 'dataLoaded',
            apiData: {
                staticShowrooms: {
                    defaultRoom: "id1",
                    "id1": {
                        "path": "some-path",
                        "label": "Some Room"
                    }
                }
            }
        }
        renderWsConnect(wsState, showroomState)
        const closeChatButton = screen.getByRole('button', { name: /close chat/i })

        const disconnectButton = screen.getByRole('button', { name: /disconnect to chat/i })

        expect(closeChatButton).toBeInTheDocument();
        expect(disconnectButton).toBeInTheDocument();
    });

    it('should render correctly when connecting', () => {
        const wsState = {
            status: wsStatus.connecting,
            ws: {
                onopen: jest.fn()
            }
        }
        const showroomState = {
            state: 'dataLoaded',
            apiData: {
                staticShowrooms: {
                    defaultRoom: "id1",
                    "id1": {
                        "path": "some-path",
                        "label": "Some Room"
                    }
                }
            }
        }
        renderWsConnect(wsState, showroomState)

        const connectingMessage = screen.getByText(/connecting to chat/i)
        const connectingHeader = screen.getByRole('heading', { name: /chat \(connecting\)/i })

        expect(connectingMessage).toBeInTheDocument()
        expect(connectingHeader).toBeInTheDocument()
    })
})