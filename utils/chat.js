import { wsStatus } from "../providers/WSProvider";

export const DisplayStatus = ({status}) => {
  switch (status) {
    case wsStatus.connected:
      return 'Connected';
    case wsStatus.disconnected:
      return 'Disconnected';
    case wsStatus.connecting:
      return 'Connecting';
    case wsStatus.disconnecting:
      return 'Disconnecting';
    default:
      throw new Error(`Invalid chat status (${status})`);
  }
}