import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import CalendlyIcon from '../CalendlyIcon/CalendlyIcon'

describe("CalendlyIcon", () => {
    let location;
    const mockLocation = new URL(`https://calendly.com/test`);

    beforeEach(() => {
        location = window.location;
        mockLocation.replace = jest.fn();
        delete window.location;
        window.location = mockLocation;
    });

    afterEach(() => {
        window.location = location;
    });

    it('should navigate to ... when link is clicked', () => {
        const calendlyId = "test"
        render(<CalendlyIcon calendlyId={calendlyId}/>);
      
        const button = screen.getByRole("button")
      
        userEvent.click(button);
      
        expect(window.location.href).toBe(`https://calendly.com/${calendlyId}`);
    });

    it('should render an empty div when calendlyId not provided', () => {
        const tree = render(<CalendlyIcon calendlyId={null}/>);

        expect(tree.baseElement.outerHTML).toBe("<body><div></div></body>")
    })
})