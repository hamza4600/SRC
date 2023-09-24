import { render, screen, waitFor } from "@testing-library/react"
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from "@testing-library/user-event"

import '../../../tests/match-media-mock';
import ShowroomNavbar from "../ShowroomNavbar/ShowroomNavbar";
import { showroomStatusOptions } from '../../providers/ShowroomProvider/ShowroomStatusOptions'

jest.mock('../NotificationDropdown', () => {
  return {
    __esModule: true,
    default: function Mock() {
      return <div data-testid="Mock Notification"></div>
    }
  }
})

let mockShowroomState = {
  status: showroomStatusOptions.dataLoaded,
  apiData: {
    defaultRoom: "main-room",
    "floor-plan": {
      img: "https://mock-img.com"
    },
    calendly: "fake-calendly",
    staticShowrooms: {
      "id1": { "label": "Some Room" },
      "id2": { "label": "Another Room" }
    }
  }
}

let mockAuthState = {
  isAuthenticated: true,
  verified: true,
}

jest.mock('../../providers/ShowroomProvider/ShowroomProvider', () => {
  return {
    useShowroom: () => {
      return [{ ...mockShowroomState }]
    }
  }
})

const mockSetCurrentRoom = jest.fn()

jest.mock('../../providers/CurrentRoomProvider/CurrentRoomProvider', () => {
  return {
    useCurrentRoom: () => {
      return [ "", mockSetCurrentRoom ]
    }
  }
})

jest.mock('../../providers/AuthProvider', () => {
  return {
    useAuthState: () => {
      return [{...mockAuthState}]
    }
  }
})

describe("ShowroomNavbar desktop", () => {
  it("should render showroom links and button correctly", () => {
    render(
        <Router>
          <ShowroomNavbar />
        </Router>
    )

    const links = screen.getAllByRole("link");
    const buttons = screen.getAllByRole("button")
    const linksLength = 6;
    const buttonsLength = 9;

    expect(links.length).toBe(linksLength)
    expect(buttons.length).toBe(buttonsLength)
  })

  it("should call setCurrentRoom when clicked on Home button", () => {
    render(
      <Router>
        <ShowroomNavbar />
      </Router>
    )

    const button = screen.getByRole("button", { name: /home/i})
    userEvent.click(button)

    expect(mockSetCurrentRoom).toHaveBeenCalled()
  })

  it("should render image when clicked on the floor plan button", async () => {
    render(
      <Router>
        <ShowroomNavbar />
      </Router>
    )

    const button = screen.getByRole("button", { name: /floor plan/i})
    userEvent.click(button)

    expect(screen.getByRole("img")).toBeInTheDocument();
  })

  it("should handle dropdown button", async () => {
    render(
      <Router>
        <ShowroomNavbar />
      </Router>
    )

    const dropdownButton = screen.getByRole("button", { name: /rooms/i})
    userEvent.click(dropdownButton)

    await waitFor(() => dropdownButton)

    const link = screen.getByText(/go to another room/i)
    userEvent.click(link);

    expect(mockSetCurrentRoom).toHaveBeenCalled();
  })

  it("should not render floor plan button when img is not provided", () => {
    mockShowroomState = {
      status: showroomStatusOptions.dataLoaded,
      apiData: {
        "floor-plan": {
          img: ""
        },
        calendly: "fake-calendly"
      }
    };
    render(
      <Router>
        <ShowroomNavbar />
      </Router>
    )

    const floorPlanButton = screen.queryByRole("button", { name: /floor plan/i})

    expect(floorPlanButton).not.toBeInTheDocument();
  })
})

describe('ShowroomNavbar Tablet/Mobile', () => {
  const { open } = window;

  beforeAll(() => {
    delete window.open;
    window.open = jest.fn();
    window.innerWidth = 400
  });

  afterAll(() => {
    window.open = open;
  });

  it('should render the links and button', () => {
    render(
        <Router>
          <ShowroomNavbar />
        </Router>
    )

    const linksLength = 6;
    const buttonsLength = 5;
    const links = screen.getAllByRole("link");
    const buttons = screen.queryAllByRole("button")
    expect(links.length).toBe(linksLength);
    expect(buttons.length).toBe(buttonsLength);
  })

  it("should not render anything if there is no data", async () => {
    mockShowroomState = {
      status: showroomStatusOptions.notLoaded,
      apiData: null
    };
    const tree = render(
        <Router>
          <ShowroomNavbar />
        </Router>
    )
    
   expect(tree.baseElement.innerHTML).toBe("<div></div>")
  })

  it("should not render floor plan button when img is not provided", () => {
    mockShowroomState = {
      status: showroomStatusOptions.dataLoaded,
      apiData: {
        "floor-plan": {
          img: null
        }
      }
    };
    render(
      <Router>
        <ShowroomNavbar />
      </Router>
    )

    const linksLength = 6;
    const buttonsLength = 4;
    const links = screen.getAllByRole("link");
    const buttons = screen.queryAllByRole("button")

    expect(links.length).toBe(linksLength);
    expect(buttons.length).toBe(buttonsLength);
  })
})

describe('Unauthed Showroom Navbar', () => {
  mockAuthState = {
    isAuthenticated: false,
    verified: false,
  }

  describe('desktop layout', () => {
    it('should render sign in and sign up links', () => {
      render(
        <Router>
          <ShowroomNavbar />
        </Router>
      )
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    })
  })
})