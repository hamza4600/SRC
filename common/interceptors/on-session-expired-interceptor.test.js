import { StatusCodes } from "http-status-codes";
import { Events } from "../../constants/events";
import { onSessionExpiredInterceptor } from './on-session-expired-interceptor';

describe("OnSessionExpiredInterceptor", () => {
  it("should call event emitter when code is 401", () => {
    const eventEmitter = { emit: jest.fn() };
    const response = { status: StatusCodes.UNAUTHORIZED };
    const error = { response };

    onSessionExpiredInterceptor(eventEmitter, error)

    expect(eventEmitter.emit).toHaveBeenCalledWith(Events.SESSION_EXPIRED);
  })

  it("should not call event emitter when status code is not 401", () => {
    const eventEmitter = { emit: jest.fn() };
    const response = { status: StatusCodes.BAD_REQUEST };
    const error = { response };

    onSessionExpiredInterceptor(eventEmitter, error)

    expect(eventEmitter.emit).not.toHaveBeenCalledWith(Events.SESSION_EXPIRED);
  })
})