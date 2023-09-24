import {Navbar} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import {useAuthState} from "../../providers/AuthProvider";
import './Header.css';
import ShowroomNavbar from '../ShowroomNavbar/ShowroomNavbar'
import { AuthenticatedNavbar } from '../AuthenticatedNavbar/AuthenticatedNavbar';
import UnauthenticatedNavbar from '../UnauthenticatedNavbar/UnathenticatedNavbar';
import { showroomStatusOptions } from "../../providers/ShowroomProvider/ShowroomStatusOptions";
import { useShowroom } from "../../providers/ShowroomProvider/ShowroomProvider";

const Header = () => {
  const authState = useAuthState();
  const location = useLocation();
  const paths = location.pathname.split('/') 
  const [showroomState, ] = useShowroom();
  
  let AuthedNavBar = UnauthenticatedNavbar;

  if ((authState && authState.verified && authState.isAuthenticated) || (authState && authState.isGuest)) {
    AuthedNavBar = AuthenticatedNavbar;
  }

  if (paths[1] === 'showrooms') {
    AuthedNavBar = ShowroomNavbar;
  }

  if (showroomState.status === showroomStatusOptions.notLoaded && paths[1] === 'showrooms') {
    return null
  }

  // TODO: hide menu if user clicks out of menu
  // TODO: hide menu if user clicks on menu
  return(
      <Navbar
        id="top-navbar"
        fixed="top"
        className='m-2 p-2 border rounded shadow-sm sticky-sm-bottom d-flex align-items-center'
      >
        <AuthedNavBar />
      </Navbar>
    
  );
}

export default Header;
