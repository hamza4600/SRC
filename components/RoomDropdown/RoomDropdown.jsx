import { Dropdown } from 'react-bootstrap'
import { GeoAltFill } from 'react-bootstrap-icons'
import * as S from './styles'

const RoomDropdown = ({ staticShowrooms, renderRoom }) => {
  if (!!staticShowrooms) {
    return (
      <S.Wrapper>
        <Dropdown>
          <S.DropdownToggleWrapper>
            <Dropdown.Toggle variant="secondary" className="btn btn-light custom-dropdown nav-link-text">
              <S.Label>
                Rooms
              </S.Label>
            </Dropdown.Toggle>
          </S.DropdownToggleWrapper>
          <S.DropdownToggleWrapper>
            <Dropdown.Toggle variant="secondary" className="btn btn-light custom-dropdown nav-link-icon">
              <GeoAltFill className='room-dropdown-icon'/>
            </Dropdown.Toggle>
          </S.DropdownToggleWrapper>
          <Dropdown.Menu>
            {Object.keys(staticShowrooms).map(room => (
              <Dropdown.Item
                key={room}
                onClick={() => renderRoom(room)}
              >
                Go to {staticShowrooms[room].label}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    </S.Wrapper>
    )
  }

  return null
}

export default RoomDropdown
