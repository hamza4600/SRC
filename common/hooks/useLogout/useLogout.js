import { useHistory } from "react-router-dom"
import urls from '../../../constants/urls'

export const useLogout = () => {
  const history = useHistory();

  return history.push(urls.signInPage.path)
}
