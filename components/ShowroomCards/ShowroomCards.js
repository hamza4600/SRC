
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import PageSpinner from './PageSpinner'


export default function ShowroomCards(props) {
 const history = useHistory()


  return (
    <>
        {
            props.showrooms && props.showrooms.length > 0 ? props.showrooms.map((showroom) => {
                return(
                    <div 
                     className='container border border-black cols-md-10 px-3 py-3 mb-3 d-flex justify-content-between align-items-center'
                     key={showroom.id}>
                        {showroom.title}
                        <Button variant="primary" onClick={() => {history.push(`/admin/showrooms/${showroom.id}`)}} >See details</Button>
                    </div>
                )
            }): props.loading ?  <PageSpinner></PageSpinner>: <>There are currently no showrooms</>
        }
    </>
  )
}
