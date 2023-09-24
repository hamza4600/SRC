import * as S from './styles'

const SignButton = ({ children, ...props }) => {
  return (
    <S.Button {...props}>{children}</S.Button>
  )
}

export default SignButton;
