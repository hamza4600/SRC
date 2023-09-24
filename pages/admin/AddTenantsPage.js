import {useContext, useEffect, useState} from 'react'
import {users} from '../../services/UserService'
import {Button, Table} from 'react-bootstrap'
import {NotificationContext} from '../../providers/NotificationProvider'
import {Link, useHistory, useParams} from 'react-router-dom'
import urls from '../../constants/urls'
import PageSpinner from '../../components/PageSpinner'


export default function AddTenantsPage() {
  const [, notificationDispatch] = useContext(NotificationContext);
  const history = useHistory()
  const params = useParams();
  const [tenants, setTenants] = useState([])
  console.log(params)

  useEffect(() => {
    let isMounted = true;
    users()
      .then(res => {
        if (res.status === 403) {
          isMounted = false
          history.push(urls.signInPage.path)
          notificationDispatch({
            type: 'error',
            payload: {
              message: 'You are not authorized to access this page',
            }
          });
        }
        if (isMounted) {
          console.log(res.data)
          setTenants(res.data)
        }
      })
      .catch(err => console.log(err))
  }, [notificationDispatch, history])

  return (
    <div>
      <Button variant="link" as={Link} to={urls.showroomAdminView.path.replace(":id", params.id)}>
        Go to showroom details
      </Button>
      <Table>
        <tbody>
        {
          tenants && tenants.length > 0 ? tenants.map((tenant) => {
            return (
              <tr key={tenant.email}>
                <td>
                  {tenant.email}
                </td>
                <td className="w-25">
                  <Button variant="link" disabled>
                    Add tenant to showroom
                  </Button>
                </td>
              </tr>
            )
          }) : <PageSpinner/>
        }
        </tbody>
      </Table>
    </div>
  )
}
