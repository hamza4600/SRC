import {Badge, NavDropdown} from "react-bootstrap";
import {IoNotificationsOutline} from "react-icons/all";
import {useNotification} from "../providers/NotificationProvider";

const NotificationButton = () => {
  const [state] = useNotification();
  const count = Object.keys(state.notifications).length;
  return (
    <>
      <IoNotificationsOutline color='grey'/>
      <span className={'counter'}>
        <Badge pill bg={count > 0 ? 'info' : 'secondary'}>{count}</Badge>
      </span>
    </>
  );
}

const NotificationItems = () => {
  const [state] = useNotification();
  const notificationKeys = Object.keys(state.notifications);

  if (notificationKeys.length === 0) {
    return (
      <NavDropdown.Item>
        There are no notifications
      </NavDropdown.Item>
    );
  }

  return notificationKeys.map(((k) => {
    const notification = state.notifications[k];
    return (
      <NavDropdown.Item key={k}>
        {notification.message}
      </NavDropdown.Item>
    )
  }))
}

const NotificationDropdown = () => {
  const [state, dispatch] = useNotification();
  const disableClearButton = Object.keys(state.notifications).length === 0;
  return (
    <NavDropdown align={{lg: 'end'}} className='notification-drawer' title={<NotificationButton/>}
                 id="notification-nav-dropdown">
      <NotificationItems/>
      <NavDropdown.Divider/>
      <NavDropdown.Item disabled={disableClearButton} onClick={() => dispatch({type: 'clear'})}>Clear
        notifications</NavDropdown.Item>
    </NavDropdown>
  )
}

export default NotificationDropdown;
