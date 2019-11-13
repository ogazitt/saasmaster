import React, { useState } from 'react';
import { useConnections } from '../utils/connections';
import Loading from './Loading';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck';


// testing link API
import { useAuth0 } from "../utils/react-auth0-wrapper";

const ConnectionsPage = () => {
  const { loading, loaded, loadConnections, connections } = useConnections();
  const [showResult, setShowResult] = useState(false);
  const [didLoad, setDidLoad] = useState(false);

  // testing link API
  const { user, getTokenSilently, loginWithRedirect, logout } = useAuth0();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // force load of connections data
  const load = async () => { 
    await loadConnections();
  };

  // if haven't loaded connections yet, do so now
  if (!loading && !didLoad) {
    load();
    setDidLoad(true);
  }

  // if results have loaded already, then show those results
  if (loaded && !showResult) {
    setShowResult(true);
  }

  // testing link API
  const call = async (action, primaryUserId, secondaryUserId) => { 
    try {
      const token = await getTokenSilently();
      
      // construct API service URL
      const baseUrl = window.location.origin;
      const urlObject = new URL(baseUrl);

      // replace port for local development from 3000 to 8080
      if (urlObject.port && urlObject.port > 80) {
        urlObject.port = 8080;
      }

      const url = urlObject + 'link';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            action: action,
            primaryUserId: primaryUserId,
            secondaryUserId: secondaryUserId 
          })
      });
      
      if (!response.ok) {
        console.error(response);
        return;
      }

      const responseData = await response.json();
      console.log(responseData);

      if (action === 'link') {
        const [provider] = primaryUserId.split('|');
        // log back in with the primary account 
        loginWithRedirect({
          access_type: 'offline', 
          connection: provider,
          redirect_uri: `${window.location.origin}`
        });
      } else {
        // refresh the page
        load();
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };  

  const link = async (provider) => { 
    // store the currently logged in userid (will be used as primary)
    localStorage.setItem('linking', 'linking');
    localStorage.setItem('primary', user.sub);
    
    // need to sign in with new IdP
    loginWithRedirect({
      access_type: 'offline', // unverified - asks for offline access
      connection: provider,
      redirect_uri: `${window.location.origin}`
    });
  }

  const linking = localStorage.getItem('linking');
  if (linking === 'linking') {
    // move the state machine from 'linking' to 'login'
    localStorage.setItem('linking', 'login');
    const primaryUserId = localStorage.getItem('primary');

    // link the accounts
    call('link', primaryUserId, user.sub);
  }

  return(
    <div>
      <h1>Connections</h1>
      <button onClick={load}>Refresh</button>
      <br/>
      <br/>
      { 
//        showResult ? <Connections/> : <div/>
        showResult ? 
        <CardDeck>
        {
          connections.map((connection, key) => {
            // set up some variables
            const connected = connection.connected;
            const uid = `${connection.provider}|${connection.userId}`;
            var border, variant, action, buttonText;
            switch (connected) {
              case 'linked':
                border = 'success';
                variant = 'danger';
                action = () => { call('unlink', null, uid) };
                buttonText = 'Disconnect';
                break;
              case 'base':
                border = 'success';
                break;
              default: 
                border = 'secondary';
                variant = 'primary';
                action = () => { link(connection.provider) };
                buttonText = 'Connect';
                break;
            }

            return (
              <Card 
                key={key} 
                //border={ connected ? 'success' : 'secondary' }
                border={ border }
                style={{ maxWidth: '150px', textAlign: 'center' }}>
                <center><Card.Img variant="top" src={connection.image} style={{ width: '8rem', marginTop: '10px' }}/></center>
                <Card.Body>
                  { connected != 'base' ? 
                   <Button variant={ variant } onClick={ action }>
                     { buttonText }
                   </Button>
                   : <center>Base Identity</center>
                   }
                </Card.Body>
              </Card>    
            )
          })
        }
        </CardDeck>
        : <div/>     
      }
    </div>
  );
};

export default ConnectionsPage;