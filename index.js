import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie';
import AuthProvider from './providers/AuthProvider';
import { WSProvider } from './providers/WSProvider';
import Compose from './components/Compose/Compose';
import {NotificationProvider} from "./providers/NotificationProvider";
import CurrentRoomProvider from "./providers/CurrentRoomProvider/CurrentRoomProvider";

ReactDOM.render(
  <React.StrictMode>
    <Compose components={[CookiesProvider, AuthProvider, WSProvider, NotificationProvider, CurrentRoomProvider]}>
      <App />
    </Compose>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
