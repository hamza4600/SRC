import { render, screen } from "@testing-library/react"
import FloorMap from '../../components/FloorMap/FloorMap'
import userEvent from "@testing-library/user-event"
import { AiOutlineConsoleSql } from "react-icons/ai"



const createSubject = () => {
    const hotspots = [
        {
            id: "mock-spot",
            top: 0.1,
            left: 0.1,
        }
    ]
    const renderRoom = jest.fn();
  
    return {
      hotspots,
      renderRoom
    }
  }

describe('the floor plan has no image', () => {
    it('should not render an img if one is not provided', () => {
        const tree = render(
            <FloorMap img={null}/>
        )

        expect(tree.baseElement.innerHTML).toBe("<div></div>")
    })

    
})

describe('the floor plan has an image', () => {
    it('should render an img if one is provided', () => {
        const tree = render(
            <FloorMap img={'test-image'} />
        )

        const imgLength = 1;
        const imgs = screen.getAllByAltText(/floor plan/i);
        expect(imgs.length).toBe(imgLength)
    })

    it('should handle renderRoom', () => {
        const {hotspots, renderRoom} = createSubject()

        render(
            <FloorMap img={'test-image'} hotspots={hotspots} renderRoom={renderRoom} />
        )

        const hotspot = screen.getByAltText('mock-spot hotspot')
        userEvent.click(hotspot)
        expect(renderRoom).toHaveBeenCalledTimes(1)
    })
})