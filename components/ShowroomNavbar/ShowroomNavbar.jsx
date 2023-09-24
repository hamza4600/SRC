import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { Nav, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useShowroom } from '../../providers/ShowroomProvider/ShowroomProvider'
import { showroomStatusOptions } from '../../providers/ShowroomProvider/ShowroomStatusOptions'
import { HouseDoorFill, ArrowCounterclockwise, BoxArrowInRight, PencilSquare, MapFill } from 'react-bootstrap-icons'
import urls from "../../constants/urls";
import Slider from '../Slider/Slider';
import { modalSettings } from '../Slider/settings';
import { useCurrentRoom } from '../../providers/CurrentRoomProvider/CurrentRoomProvider';
import NotificationDropdown from "../NotificationDropdown";
import Modal from '../Modal/Modal';
import RoomDropdown from '../RoomDropdown/RoomDropdown';
import CalendlyIcon from '../CalendlyIcon/CalendlyIcon';
import FloorMap from "../FloorMap/FloorMap";
import { useAuthState } from "../../providers/AuthProvider";
import { AuthenticatedNavbar } from '../AuthenticatedNavbar/AuthenticatedNavbar';
import * as S from './styles'
import {openCart} from '../../services/Shopify/Shopify'
import ShopifyModal from "../ShopifyModal/ShopifyModal";
import InteractiveTutorial from "../InteractiveTutorial/InteractiveTutorial";

const ShowroomNavbar = () => {
  const slider = useRef(null);
  const authState = useAuthState();
  const [show, setShow] = useState(false);
  const [, setCurrentRoom] = useCurrentRoom();
  const location = useLocation();
  const pathname = location.pathname
  
  const [showroom] = useShowroom();
  const showroomData = showroom.apiData
  
  const renderRoom = (room) => {
    setCurrentRoom(room)
  }

  const handleClick = () => {
    setShow(!show);
  }

  const handleHomeClick = () => {
    renderRoom(showroomData.defaultRoom)
  }

  const renderSlider = () => {
    const floorPlanImg = showroomData["floor-plan"].img;
    const floorPlanHotspots = showroomData["floor-plan"].hotspots

    return (
      <Slider ref={slider} settings={modalSettings}>
        <FloorMap img={floorPlanImg} hotspots={floorPlanHotspots} renderRoom={renderRoom} />
      </Slider>
    )
  }   

  const handleToggleCart = (event) => {
    event.stopPropagation();
    openCart();
  };

  if (showroom.status === showroomStatusOptions.dataLoaded  && showroomData) {
    return (
      <>
        <Nav className='ms-auto d-flex align-items-center'>
          {!!showroomData["floor-plan"].img && (
              <img 
              alt="Hidden floor plan"
              src={showroomData["floor-plan"].img }
              style={{ display: "none" }}
            />
          )}
          <>
            <Nav.Link as={Button} onClick={handleHomeClick} className="btn btn-light nav-link-text">Home</Nav.Link>
            <Nav.Link as={Button} onClick={handleHomeClick}  className="btn btn-light nav-link-icon"><HouseDoorFill /></Nav.Link>
            <NotificationDropdown />
            <RoomDropdown 
              staticShowrooms={showroomData.staticShowrooms}
              renderRoom={renderRoom}
            />
            {!!showroomData["floor-plan"].img && (
              <>
                <S.ButtonLink>
                  <Nav.Link
                    as={Button}
                    className='btn btn-light nav-link-text'
                    onClick={handleClick}
                  >
                    Floor plan
                  </Nav.Link>
                </S.ButtonLink>
                <S.ButtonLink>
                  <Nav.Link
                    as={Button}
                    className='btn btn-light nav-link-icon'
                    onClick={handleClick}
                  >
                    <MapFill />
                  </Nav.Link>
                </S.ButtonLink>
              </>
            )}
            { showroom.apiData.shopifyData ? 
             <ShopifyModal onClick={handleToggleCart} />:
              <></>
            }
            <InteractiveTutorial />
            <Nav.Link as={Link} to={urls.requestPasswordReset.path} className="nav-link-text">Reset password</Nav.Link>
            <Nav.Link as={Link} to={urls.requestPasswordReset.path} className="nav-link-icon"><ArrowCounterclockwise /></Nav.Link>
            <CalendlyIcon calendlyId={showroomData.calendly}/>
            {(authState && authState.verified && authState.isAuthenticated) || (authState && authState.isGuest) ? 
              <AuthenticatedNavbar /> : 
            <>
              <Nav.Link as={Link} to={`${urls.signInPage.path}?url=${pathname}`} className="nav-link-text">Sign In</Nav.Link>
              <Nav.Link as={Link} to={`${urls.signInPage.path}?url=${pathname}`} className="nav-link-icon"><BoxArrowInRight /></Nav.Link>
              <Nav.Link as={Link} to={urls.signUpPage.path} className="nav-link-text">Sign Up</Nav.Link>
              <Nav.Link as={Link} to={urls.signUpPage.path} className="nav-link-icon"><PencilSquare /></Nav.Link>
            </>}
          </>
        </Nav>
        <Modal
          title={"Where do you want to go?"}
          body={renderSlider()}
          show={show}
          handleClose={handleClick}
        />
      </>
    )
  }

  return null
}

export default ShowroomNavbar;
