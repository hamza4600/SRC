import { useState } from 'react';
import { useHistory } from "react-router";

import Modal from '../../../components/Modal/Modal';
import RenewSessionOptions from '../../../components/RenewSessionOptions/RenewSessionOptions';
import { getCookie, eraseCookie } from '../../../services/Cookie/CookieService'
import { SignInAsGuestService } from '../../../services/SignInAsGuestService';


export const RenewSessionListener = ({ durationInMilliseconds }) => {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const handleSessionListener = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleRenewSession = async () => {
    const fullName = getCookie("fullName")
    const data = { fullName }

    try {
      await SignInAsGuestService(data)
    } catch (err) {
      return;
    }
  }

  const handleLogout = () => {
    eraseCookie("token")
    eraseCookie("fullName")

    return history.push("/")
  }

  if (!!durationInMilliseconds) {
    setTimeout(() => {
      handleSessionListener();
    }, durationInMilliseconds)

    return (
      <Modal
        show={isOpen}
        title="Renew session?"
        handleClose={handleClose}
        body={
          <RenewSessionOptions
            onRenewSession={handleRenewSession}
            onLogout={handleLogout}
        />}
      />
    )
  }

  return null;
}
