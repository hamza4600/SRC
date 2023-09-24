import { createContext, useState, useContext } from "react";

const CurrentRoomContext = createContext();

const CurrentRoomProvider = ({ children }) => {
  const [ currentRoom, setCurrentRoom ] = useState(null);

  return (
    <CurrentRoomContext.Provider value={[ currentRoom, setCurrentRoom ]}>
      {children}
    </CurrentRoomContext.Provider>
  )
}

export const useCurrentRoom = () => {
  return useContext(CurrentRoomContext);
}

export default CurrentRoomProvider;