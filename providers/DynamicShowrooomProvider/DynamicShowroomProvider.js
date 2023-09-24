import { createContext, useContext, useReducer } from "react";
import { showroomStatusOptions } from "../ShowroomProvider/ShowroomStatusOptions";

const initDynamicShowroomContext = {
  status: showroomStatusOptions.notLoaded,
  apiData: null,
  selectedModel: null,
  isPointerLocked: false,
  isJoystickPresent: false,
  joystickPosition: { x: 0, y: 0 },
  joystickDirection: { x: 0, y: 0 }
}

const dynamicShowroomContext = createContext();
const dynamicShowroomReducer = (state, action) => {
  switch (action.type) {
    case showroomStatusOptions.dataLoaded:
      return {
        ...state,
        status: showroomStatusOptions.dataLoaded,
        apiData: action.payload,
      }
    case 'setSelectedModel':
      return {
        ...state,
        selectedModel: action.payload
      }
    case 'setPointerLock':
      return {
        ...state,
        isPointerLocked: action.payload
      }
    case 'setJoystickPresent':
      return {
        ...state,
        isJoystickPresent: action.payload
      }
    case 'setJoystickPosition':
      return {
        ...state,
        joystickPosition: action.payload
      }
    case 'setJoystickDirection':
      return {
        ...state,
        joystickDirection: action.payload
      }
    default:
      throw new Error(`invalid action: ${action.type}`);
  }
}

const DynamicShowroomProvider = ({ children, reducer }) => {
  return (
    <dynamicShowroomContext.Provider value={reducer}>
      {children}
    </dynamicShowroomContext.Provider>
  )
}

export const useDynamicShowroomReducer = (initContext) => {
  return useReducer(dynamicShowroomReducer, initContext ? initContext : initDynamicShowroomContext);
}

export const useDynamicShowroom = () => {
  return useContext(dynamicShowroomContext);
}

export default DynamicShowroomProvider;
