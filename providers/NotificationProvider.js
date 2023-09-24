import {createContext, useContext, useReducer} from "react";
import {toast, ToastContainer} from "react-toastify";

const initialNotification = {
  notifications: {}
};

const NotificationContext = createContext(initialNotification)

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'error':
    case 'info':
      const payload = {...action.payload, data: Date.now()}
      const id = Buffer.from(JSON.stringify(payload)).toString('base64');

      if (payload.addToSession || false) {
        state.notifications[id] = payload;
      }

      if (payload.showToast || true) {
        toast[action.type](payload.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      return {...state}
    case 'clear':
      return {notifications: {}}
    default:
      throw Error(`failed to recognize action ${action.type}`);
  }
}

const NotificationProvider = ({children}) => {

  const [notificationState, notificationDispatcher] = useReducer(
    notificationReducer,
    initialNotification
  );

  return (
    <NotificationContext.Provider value={[notificationState, notificationDispatcher]}>
      <ToastContainer/>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext);

export {
  NotificationContext,
  NotificationProvider,
}
