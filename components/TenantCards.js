import {Button, Table} from "react-bootstrap"



export default function TenantCards(props) {
    
  return (
    <Table>
        <tbody>
          {
            props.tenants && props.tenants.length > 0 ? props.tenants.map((tenant) => {
              return(
                <tr key={tenant.email}>
                  <td>
                    {tenant.email}
                  </td>
                  <td className="w-25">
                    {props.removable ?
                      <Button variant="link" disabled>
                        Add tenant to showroom
                      </Button>: <Button variant="link" disabled>Remove from showroom</Button>}
                    {/*<Button variant="link" as={Link} to={urls.showroomAdminView.path.replace(":id", showroom.id)} disabled>*/}
                    {/*  Go to showroom*/}
                    {/*</Button>*/}
                  </td>
                </tr>
              )
            }): (
              <tr>
                <td>
                  There are currently no tenants
                </td>
              </tr>
            )
          }
        </tbody>
    </Table>
  )
}
