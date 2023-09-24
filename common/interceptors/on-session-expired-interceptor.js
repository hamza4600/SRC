import { StatusCodes } from "http-status-codes";

import { Events } from '../../constants/events'

export function onSessionExpiredInterceptor(eventEmitter, error) {
  if (error.response.status === StatusCodes.UNAUTHORIZED) {
    eventEmitter.emit(Events.SESSION_EXPIRED)
  }

  return error.response
}