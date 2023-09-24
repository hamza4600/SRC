import React from 'react'
import { CartFill } from 'react-bootstrap-icons'
import { Nav, Button } from 'react-bootstrap'

const ShopifyModal = ({onClick}) => {
  return (
    <>
        <Nav.Link as={Button} className="nav-link-text btn btn-light" onClick={(event) => {onClick(event)}}>
            Cart
        </Nav.Link>
        <Nav.Link as={Button} className="nav-link-icon btn btn-light" onClick={(event) => {onClick(event)}}>
            <CartFill />
        </Nav.Link>
    </>
  )
}

export default ShopifyModal;
