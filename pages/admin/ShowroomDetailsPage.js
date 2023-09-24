import {useContext, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap';
import {Link, useHistory, useParams} from 'react-router-dom';
import urls from '../../constants/urls';
import {NotificationContext} from "../../providers/NotificationProvider"
import TenantCards from '../../components/TenantCards';
import {showroom} from '../../services/ShowroomService';

export default function ShowroomDetailsPage() {
  const [, notificationDispatch] = useContext(NotificationContext);
  const [roomData, setRoomData] = useState({});
  const tenantData = [
    {username: "1", email: "vlad@email.com", fullName: "Vladimir Kubliy"},
    {username: "2", email: "test@email.com", fullName: "Test Account"}
  ]
  const [tenants] = useState(tenantData)
  const history = useHistory();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    let isMounted = true;
    showroom(id)
      .then(res => {
        if (res.status === 403) {
          isMounted = false;
          history.push(urls.signInPage.path)
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'You are not authorized to access this showroom',
            }
          });
        }
        if (isMounted) {
          setRoomData(res.data);
        }
      })
      .catch(err => console.log(err))
  }, [id, history, notificationDispatch])

  return (
    <div>
      <ul>
        <li>Title: {roomData.title}</li>
        <li>Room Type: {roomData.type}</li>
        <li>Visibility: {roomData.accessibility === "PB" ? <p>Public</p> : <p>Demo</p>}</li>
        <li>Google Analytics:</li>
        <li>
          <Button variant="link" as={Link} to={urls.showroomIndex.path}>showroom index</Button>
          <Button variant="link" as={Link} to={urls.addTentant.path.replace(":id", id)}>Add tenant</Button>
        </li>
      </ul>
      <div>Tenants:</div>
      <TenantCards tenants={tenants} showroomId={id} removable={false}/>
    </div>
  )
}
