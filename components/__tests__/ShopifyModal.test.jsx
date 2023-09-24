import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ShopifyModal from '../ShopifyModal/ShopifyModal'

describe("ShopifyModal", () => {

    it('should render two buttons', () => {
        const onClick = jest.fn()
        render(<ShopifyModal onClick={onClick}/>)
        const buttonsLength = 2
        const buttons = screen.getAllByRole("button")
      
        expect(buttons.length).toBe(buttonsLength);
    });

    it('should trigger onClicks Properly', () => {
        const onClick = jest.fn()
        render(<ShopifyModal onClick={onClick}/>)
        const buttons = screen.getAllByRole("button")
        
        userEvent.click(buttons[0])
        userEvent.click(buttons[1])

        expect(onClick).toHaveBeenCalledTimes(2)
    })
})