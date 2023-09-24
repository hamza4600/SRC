import {useContext, useEffect, useState} from 'react'
import {showrooms} from '../../services/ShowroomService'
import {useHistory} from 'react-router-dom/cjs/react-router-dom.min'
import {Button, Table} from 'react-bootstrap'
import PageSpinner from '../../components/PageSpinner'
import {NotificationContext} from "../../providers/NotificationProvider"
import urls from '../../constants/urls'
import {Link} from "react-router-dom";

export default function ShowroomIndexPage() {
  const [showroomsData, setShowroomsData] = useState([])
  const [loading, setLoading] = useState(true)
  const history = useHistory()

  const [, notificationDispatch] = useContext(NotificationContext);

  useEffect(() => {
    if (loading) {
      showrooms()
        .then(res => {
          setLoading(false)
          setShowroomsData(res.data)
        })
        .catch(err => {
          // TODO: handle unauthorized
          setLoading(false)
          console.log(err.status);
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'You are not authorized to access this page',
            }
          });
        })
    }
  }, [history,loading, notificationDispatch])

  return (
    <Table>
      <tbody>
      {
        showroomsData && showroomsData.length > 0 ? showroomsData.map((showroom) => {
          return (
            <tr key={showroom.id}>
              <td>
                {showroom.title}
              </td>
              <td className="w-25">
                <Button variant="link" as={Link} to={urls.showroomAdminView.path.replace(":id", showroom.id)}>
                  View details
                </Button>
                {/*<Button variant="link" as={Link} to={urls.showroomAdminView.path.replace(":id", showroom.id)} disabled>*/}
                {/*  Go to showroom*/}
                {/*</Button>*/}
              </td>
            </tr>
          )
        }) : loading ? (
          <tr>
            <td><PageSpinner/></td>
          </tr>
        ) : (
          <tr>
            <td>There are currently no showrooms to show</td>
          </tr>
        )
      }
      </tbody>
    </Table>
  )
}
