import { screen, render } from "@testing-library/react";
import ChatUsersList from "../ChatUsersList/ChatUsersList";

describe('ChatUsersList', () => {
    it('should render all the user info correctly',() => {
        const users = [
            {
                fullName: 'tester1'
            },
            {
                fullName: 'tester2'
            },
        ];
        render(
            <ChatUsersList users={users}/>
        );

        const title = screen.getByText(/connected users:/i);
        const tester1 = screen.getByText(/tester1/i);
        const tester2 = screen.getByText(/tester2/i);

        expect(title).toBeInTheDocument();
        expect(tester1).toBeInTheDocument();
        expect(tester2).toBeInTheDocument();
    })
})
