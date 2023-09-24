import { render, screen, waitFor } from "@testing-library/react"
import RoomDropdown from '../RoomDropdown/RoomDropdown'
import { Router } from "react-router-dom"
import {createMemoryHistory} from 'history'
import userEvent from "@testing-library/user-event"

const createSubject = () => {
    const staticShowrooms = {
        "id1": {
            "label": "Some Room"
        },
        "id2": {
            "label": "Another Room"
        }
    }
    const renderRoom = jest.fn();
  
    return {
      staticShowrooms,
      renderRoom
    }
  }

describe("RoomList", () => {
    it('should render a list of items', async () => {
        const history = createMemoryHistory()
        const { staticShowrooms, renderRoom } = createSubject();
        render(
         <Router history={history}>
            <RoomDropdown staticShowrooms={staticShowrooms} renderRoom={renderRoom} label={'Rooms'}/>
         </Router>
        )

        const roomDropdown = screen.getByRole("button", { name: /rooms/i})

        userEvent.click(roomDropdown)

        await waitFor(() => roomDropdown)

        expect(screen.getByRole("button", { name: /Go to Some Room/i})).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /Go to Another Room/i})).toBeInTheDocument()
    })

    it("should handle renderRoom", async () => {
        const history = createMemoryHistory()
        const { staticShowrooms, renderRoom } = createSubject();
    
        render(
            <Router history={history}>
               <RoomDropdown staticShowrooms={staticShowrooms} renderRoom={renderRoom} label={'Rooms'}/>
            </Router>
        )

        const roomDropdown = screen.getByRole("button", { name: /rooms/i})

        userEvent.click(roomDropdown)

        await waitFor(() => roomDropdown)

        const goToSomeRoom = screen.getByRole("button", { name: /Go to Some Room/i})
        const goToAnotherRoom = screen.getByRole("button", { name: /Go to Another Room/i})
        userEvent.click(goToSomeRoom)
        userEvent.click(goToAnotherRoom)

        expect(renderRoom).toHaveBeenCalledTimes(2)
    })
})