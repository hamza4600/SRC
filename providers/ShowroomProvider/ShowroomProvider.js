import { createContext, useContext, useReducer } from "react";
import { showroomStatusOptions } from "./ShowroomStatusOptions";
import { showroomSetOptions } from './ShowroomSetOptions';

const initShowroomContext = {
  status: showroomStatusOptions.notLoaded,
  apiData: null,
  selectedModel: null,
  isPointerLocked: false,
  isJoystickPresent: false,
  joystickPosition: { x: 0, y: 0 },
  joystickDirection: { x: 0, y: 0 },
};

const showroomContext = createContext();

const showroomReducer = (state, action) => {
  console.log(state, action)
  switch (action.type) {
    case showroomStatusOptions.dataLoaded:
      return {
        ...state,
        status: showroomStatusOptions.dataLoaded,
        apiData: action.payload,
      };
    case showroomSetOptions.setSelectedModel:
      return {
        ...state,
        selectedModel: action.payload
      }
    case showroomSetOptions.setPointerLock:
      return {
        ...state,
        isPointerLocked: action.payload
      }
    case showroomSetOptions.setJoystickPresent:
      return {
        ...state,
        isJoystickPresent: action.payload
      }
    case showroomSetOptions.setJoystickPosition:
      return {
        ...state,
        joystickPosition: action.payload
      }
    case showroomSetOptions.setJoystickDirection:
      return {
        ...state,
        joystickDirection: action.payload
      }
    case showroomStatusOptions.error:
      return {
        ...state,
        status: showroomStatusOptions.error,
        apiData: action.payload,
      };
    default:
      throw new Error(`invalid action: ${action.type}`);
  }
};

const ShowroomProvider = ({ children, initContext }) => {
  const [state, dispatch] = useReducer(
    showroomReducer,
    initContext ? initContext : initShowroomContext
  );
  return (
    <showroomContext.Provider value={[state, dispatch]}>
      {children}
    </showroomContext.Provider>
  );
};

export const useShowroom = () => {
  return useContext(showroomContext);
};

export default ShowroomProvider;
