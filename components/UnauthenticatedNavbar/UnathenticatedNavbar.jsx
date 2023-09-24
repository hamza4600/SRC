import { Nav, Navbar } from 'react-bootstrap'
import { HouseDoorFill, ArrowCounterclockwise ,BoxArrowInRight, PencilSquare } from 'react-bootstrap-icons'
import { Link, useLocation } from 'react-router-dom'
import urls from '../../constants/urls'
import NotificationDropdown from '../NotificationDropdown'

const UnauthenticatedNavbar = () => {
    const location = useLocation();
    return (
      <>
        <Nav className="me-auto">
          <Navbar.Brand as={Link} to={urls.homePage.path}>Mantis XR</Navbar.Brand>
        </Nav>
        <Nav>
          <>
            <Nav.Link as={Link} to={urls.homePage.path} className="nav-link-text">Home</Nav.Link>
            <NotificationDropdown />
            <Nav.Link as={Link} to={urls.requestPasswordReset.path} className="nav-link-text">Reset password</Nav.Link>
            <Nav.Link as={Link} to={`${urls.signInPage.path}?url=${location.pathname}`} className="nav-link-text">Sign In</Nav.Link>
            <Nav.Link as={Link} to={`${urls.signUpPage.path}?url=${location.pathname}`} className="nav-link-text">Sign Up</Nav.Link>
            <Nav.Link as={Link} to={urls.homePage.path} className="nav-link-icon"><HouseDoorFill /></Nav.Link>
            <Nav.Link as={Link} to={urls.requestPasswordReset.path} className="nav-link-icon"><ArrowCounterclockwise /></Nav.Link>
            <Nav.Link as={Link} to={`${urls.signInPage.path}?url=${location.pathname}`} className="nav-link-icon"><BoxArrowInRight/></Nav.Link>
            <Nav.Link as={Link} to={`${urls.signUpPage.path}?url=${location.pathname}`} className="nav-link-icon"><PencilSquare /></Nav.Link>
          </> 
        </Nav>
      </>
    )
  }

export default UnauthenticatedNavbar;