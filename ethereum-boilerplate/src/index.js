import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import "./assets/animated.css";
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import '../node_modules/elegant-icons/style.css';
import '../node_modules/et-line/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import './assets/style.scss';
import { MoralisProvider } from "react-moralis";
import "./index.css";
import * as serviceWorker from './serviceWorker';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import QuickStart from "components/QuickStart";

//redux store
import { Provider } from 'react-redux'
import store from './store';

/** Get your free Moralis Account https://moralis.io/ */

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Application = () => {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
  //Validate
  if (!APP_ID || !SERVER_URL)
    throw new Error(
      "Missing Moralis Application ID or Server URL. Make sure to set your .env file."
    );
  if (isServerInfo)
    return (
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <App isServerInfo />
      </MoralisProvider>
    );
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QuickStart />
      </div>
    );
  }
};

/* ReactDOM.render(
  <StrictMode>
    <Application />,
  </StrictMode>,
  document.getElementById("root")
); */
ReactDOM.render(
	<Provider store={store}>
		<Application />
	</Provider>, 
	document.getElementById('root'));
serviceWorker.unregister();



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();


