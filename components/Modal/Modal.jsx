import { Modal as ReactModal } from 'react-bootstrap'

const Modal = ({ title, body, show, handleClose, fullscreen = false }) => {
  const isTitleAvailable = !!title;

  return (
    <ReactModal show={show} onHide={handleClose} fullscreen={fullscreen}>
      <ReactModal.Header closeButton>
        {isTitleAvailable && (
          <ReactModal.Title>{title}</ReactModal.Title>
        )}
      </ReactModal.Header>
      <ReactModal.Body>{body}</ReactModal.Body>
    </ReactModal>
  )
}

export default Modal