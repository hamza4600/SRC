import EventEmitterListener from "../EventEmitterListener/EventEmitterListener"
import { EventEmitter } from '../../providers/EventEmitter'
import { Events } from '../../../constants/events'
import { useLogout } from "../../hooks/useLogout/useLogout"

const SessionExpiredListener = () => {
  const logout = useLogout();
  return (
    <EventEmitterListener
      eventEmitter={EventEmitter.getInstance()}
      event={Events.SESSION_EXPIRED}
      callback={() => logout()}
    />
  )
}

export default SessionExpiredListener;
