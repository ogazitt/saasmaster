import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './pages/AppWrapper';
import * as serviceWorker from './serviceWorker';

import { Auth0Provider } from "./utils/react-auth0-wrapper";
import { ConnectionsProvider } from "./utils/connections";
import config from "./utils/auth_config.json";

// import bootstrap and font-awesome CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

// import local styles after default styles so they take precedence
import './index.css';

//import history from "./utils/history";

// A function that routes the user to the right place after login

const onRedirectCallback = appState => {
  // if this login was a result of linking, then redirect to /conns
  const linking = localStorage.getItem('linking');
  if (linking) {
    if (linking === 'login') {
      // completed the linking process - remove storage keys
      localStorage.removeItem('linking');
      localStorage.removeItem('primary');
    }  
    
    window.history.replaceState(
      {},
      document.title,
      `${window.location.origin}/business/conns`
    );
    return;
  }

  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
//      : `${window.location.pathname}/home`
//      : window.location.pathname
      : `${window.location.origin}/business/home`
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
    <ConnectionsProvider>
      <AppWrapper />
    </ConnectionsProvider>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
