import { Dropdown, DropdownButton, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import urls from "../../constants/urls";
import { SignOut } from "../../services/AuthService";
import { useAuthDispatch, useAuthState } from "../../providers/AuthProvider";
import { useHistory } from "react-router";
import { DisplayName } from "../../utils/user";
import WSConnectLink from "../WSConnectLink/WSConnectLink";


export const AuthenticatedNavbar = () => {
  const authState = useAuthState();
  const dispatch = useAuthDispatch();
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname

  const triggerSignOut = () => {
    SignOut();
    dispatch({
      type: 'logout_success',
    });
    history.push(pathname);
  };

  return (
    <Nav className="ms-auto">
      <Navbar.Collapse id="main-navbar-nav">
        <Nav>
        <DropdownButton
            className="signed-in-dropdown-button"
            title={`${DisplayName({ fullName: authState.attributes.name })}`}
            id="main-nav-dropdown"
            drop="start"
            type="button"
          >
            <WSConnectLink />
            <Dropdown.Header>Other</Dropdown.Header>
            <Dropdown.Item as={Link} to={urls.aboutPage.path}>About</Dropdown.Item>
            <Dropdown.Item as={Link} to={urls.updatePassword.path}>Update password</Dropdown.Item >
            <Dropdown.Item  onClick={triggerSignOut}>Sign Out</Dropdown.Item >
          </DropdownButton>
        </Nav>
      </Navbar.Collapse>
    </Nav> 
  );
};
