import {createContext, useContext, useEffect, useReducer} from 'react';

export const wsStatus = {
  disconnect: 'DISCONNECT',
  disconnected: 'DISCONNECTED',
  disconnecting: 'DISCONNECTING',
  connect: 'CONNECT',
  connected: 'CONNECTED',
  connecting: 'CONNECTING',
}

export const chatStatus = {
  open: "OPEN",
  closed: "CLOSED"
}

const defaultWSState = {
  status: wsStatus.disconnected,
  chatStatus: chatStatus.open,
  messages: [],
  users: [],
  usersShown: false,
  ws: null,
  interval: null,
  token: null,
  eventId: null,
  userType: 'guest',
  fullName: null
};

const WSState = createContext();
const TEN_MINUTES = 550000;

const wsUrl = process.env.REACT_APP_WS;

const wsReducer = (state, action) => {
  switch (action.type) {
    case wsStatus.connect:
      console.log('initiating connect');
      return {
        ...state,
        token: action.token,
        fullName: action.fullName,
        userType: action.userType,
        eventId: action.eventId,
        status: wsStatus.connecting,
        ws: new WebSocket(`${wsUrl}?Auth=${action.token}&eventId=${action.eventId}&userType=${action.userType}&fullName=${action.fullName}`)
      };
    case wsStatus.connected:
      console.log('connected');
      setInterval(state.ws.send('ping'), 500)
      return {
        ...state,
        status: wsStatus.connected,
      };
    case wsStatus.disconnect:
      console.log('initiating disconnect');
      state.ws.close();
      return {
        ...state,
        status: wsStatus.disconnecting,
        ws: null,
      };
    case wsStatus.disconnected:
      console.log('disconnected');
      return {
        ...state,
        chatStatus: chatStatus.closed,
        messages: [],
        status: wsStatus.disconnected,
      };
    case 'USER_JOINT':
      console.log('sending user join');
      state.ws.send(JSON.stringify({
        "action": 'userJoin',
        eventId: state.eventId,
        "fullName": state.fullName,
        userType: state.userType
      }))
      return {
        ...state,
      }
      case 'USER_LEFT':
        console.log('sending user-left')
        state.ws.send(JSON.stringify({
          "action": 'userLeft',
        }))
        return {
          ...state,
        }
    case 'send-message':
      console.log(`sending ${action.text}`)
      state.messages.push({
        text: action.text,
        name: state.fullName
      })
      state.ws.send(JSON.stringify({
        "action": "message",
        "data": action.text
      }));
      
      return {
        ...state,
      }
    case chatStatus.open:
      console.log('opening chat')
      return {
      ...state,
      chatStatus: chatStatus.open,
    };
    case chatStatus.closed:
      return {
        ...state,
        chatStatus: chatStatus.closed,
      }
    case 'set-messages':
      state.messages.push(action.payload)
      return {
        ...state
      }
    case 'userList':
      console.log('list users')
      if (!state.usersShown) {
        state.ws.send(JSON.stringify({
          action: "userList",
        }))
      }
      return {
        ...state,
        usersShown: !state.usersShown
      }
    case 'set-users':
      return {
        ...state,
        users: action.payload
      }
    /**
     * DEFAULT
     */
    default:
      return state;
  }
}

export const useWS = () => {
  return useContext(WSState);
}


const WSProvider = ({children, initContext, eventId}) => {
  const [state, dispatch] = useReducer(
    wsReducer,
    initContext ? initContext : {...defaultWSState, eventId}
  );

  useEffect(() => {
    const ping = () => {
      if (state.status === wsStatus.connected) {
        state.ws.send('ping')
      }
    }

    if (state && state.status === wsStatus.connecting && state.ws !== null) {
      state.ws.onopen = () => {
        console.log('WS onopen');
        dispatch({type: wsStatus.connected});
        dispatch({type:"USER_JOINT"})
      }

      state.ws.onmessage = (e) => {
        console.log(e)
        const data = JSON.parse(e.data)
        console.log(data)
        if (data.message && data.message !== 'Internal server error') {
          const payload = {text: data.message, name: data.from || 'MantisXR'}
          dispatch({type: 'set-messages', payload: payload})
        }
        if (data.users) {
          dispatch({type: 'set-users', payload: data.users})     
        }
      }

      state.ws.onclose = () => {
        console.log('WS onclose');
        clearInterval(state.interval)
        state.interval = null;
        dispatch({type: wsStatus.disconnected});
      }

      state.ws.onerror = (e) => {
        console.error('WS onerror', e);
      }
    }
    if (state && state.status === wsStatus.connected && state.ws !== null) {
      state.interval = setInterval(ping, TEN_MINUTES)
    }
    if (state && state.status === wsStatus.disconnected && state.ws !== null) {
      clearInterval(state.interval)
      state.interval = null;
    }
  }, [state]);

  return (
    <WSState.Provider value={[state, dispatch]}>
      {children}
    </WSState.Provider>
  );
};

export {
  WSProvider,
  WSState,
};