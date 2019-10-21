import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppWrapper from './components/AppWrapper';
import * as serviceWorker from './serviceWorker';

import { Auth0Provider } from "./utils/react-auth0-wrapper";
import config from "./utils/auth_config.json";

import 'bootstrap/dist/css/bootstrap.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

//import history from "./utils/history";

/*
const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};
*/
// A function that routes the user to the right place
// after login

const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

//const defaultScopes = 'https://www.googleapis.com/auth/contacts.readonly';

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    audience={config.audience}
    onRedirectCallback={onRedirectCallback}
/*    scope={defaultScopes}*/
  >
    <AppWrapper />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
