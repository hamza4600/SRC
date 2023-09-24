import { useState } from "react";

import * as S from './styles';

const Snackbar = ({ message, durationInMilliseconds }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  }

  setTimeout(() => {
    handleClose();
  }, durationInMilliseconds);

  return (
    <S.SnackbarContainer isOpen={isOpen}>
      {message}
    </S.SnackbarContainer>
  )
}

export default Snackbar;
