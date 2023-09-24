import { Dropdown } from "react-bootstrap";
import { useWS, wsStatus } from "../../providers/WSProvider";
import { chatStatus } from "../../constants/chatStatusOptions";
import { getSession } from "../../services/AuthService"
import { DisplayStatus } from "../../utils/chat";
import { useShowroom } from "../../providers/ShowroomProvider/ShowroomProvider"
import { showroomStatusOptions } from "../../providers/ShowroomProvider/ShowroomStatusOptions"
import { useCookies } from "react-cookie";

const WSConnectLink = () => {
  const [state, dispatch] = useWS();
  const [showroomState] = useShowroom();
  const [cookies] = useCookies(['token', 'fullName'])
  let eventId = null;
  let token = null;
  let fullName = null;
  let userType = 'guest'
  getSession().then(data => {
    if (data) {
      token = data.userSession.accessToken.jwtToken;
      fullName = data.userSession.idToken.payload.name;
      if (data.userSession.idToken.payload["cognito:groups"]?.[0] === "Admins") {
        userType = 'admin'
      }
    } else if (cookies.token && cookies.fullName){
      token = cookies.token
      fullName = cookies.fullName
    }
  })
  
  let button = null;
  
  switch (state.status) {
    case wsStatus.disconnected:
      if (showroomState.status === showroomStatusOptions.dataLoaded) {
        eventId = showroomState.apiData.id;
        button = <Dropdown.Item onClick={() => 
          {
            dispatch({ 
              type: wsStatus.connect, 
              token: token, 
              eventId: eventId, 
              userType: userType, 
              fullName: fullName
            })
          }}>Connect to chat</Dropdown.Item>;
      }
      break;
    case wsStatus.connecting:
      button = <Dropdown.ItemText>Connecting to chat</Dropdown.ItemText>;
      break;
    case wsStatus.connected:
      button =
        <>
          {state.chatStatus === chatStatus.open ? 
            <Dropdown.Item onClick={() => dispatch({type: chatStatus.closed})}>Close Chat</Dropdown.Item> :
            <Dropdown.Item onClick={() => dispatch({type: chatStatus.open})}>Open Chat</Dropdown.Item> 
          }
          <Dropdown.Item onClick={() => {
            dispatch({type: "USER_LEFT"})
            dispatch({ type: wsStatus.disconnected }
          )}}>Disconnect to chat</Dropdown.Item>
        </>;
      break;
    default:
      throw new Error(`failed to show ws button: invalid status ${state.status}`);
  }

  return (
    <>
      <Dropdown.Header>Chat ({DisplayStatus({ status: state.status })})</Dropdown.Header>
      {button}
    </>
  );
};

export default WSConnectLink;
