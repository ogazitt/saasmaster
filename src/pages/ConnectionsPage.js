import React, { useState } from 'react'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Modal from 'react-bootstrap/Modal'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { post } from '../utils/api'

const ConnectionsPage = () => {
  const { loading, loadConnections, connections } = useConnections();
  const [errorMessage, setErrorMessage] = useState();
  const { user, getTokenSilently, loginWithRedirect } = useAuth0();
  const [showModal, setShowModal] = useState(false);
  const [linkProvider, setLinkProvider] = useState();
  const pageTitle = 'Reputation sources';

  // if in the middle of a loading loop, put up loading banner and bail
  if (!connections && loading) {
    return <Loading />
  }

  if (connections && connections.find) {
    errorMessage && setErrorMessage(null);
  } else {
    !errorMessage && setErrorMessage("Can't reach service - try refreshing later");
  }

  // call the link / unlink user API
  const call = async (action, primaryUserId, secondaryUserId) => { 
    try {
      const token = await getTokenSilently();
      const body = JSON.stringify({ 
        action: action,
        primaryUserId: primaryUserId,
        secondaryUserId: secondaryUserId 
      });

      const [response, error] = await post(token, 'link', body);
      if (error || !response.ok) {
        return;
      }

      const responseData = await response.json();
      const success = responseData && responseData.message === 'success';

      // if linking was successful, re-login with primary account
      if (action === 'link' && success) {
        const [provider] = primaryUserId.split('|');
        // log back in with the primary account 
        console.log(`redirecting to ${window.location.origin}`)
        loginWithRedirect({
          access_type: 'offline', 
          connection: provider,
          redirect_uri: `${window.location.origin}`
        });
      } else {
        // refresh the page
        loadConnections();
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };  

  // start the account linking process
  // linking state machine: null => linking => login => null
  const link = (provider) => { 
    // move the state machine from null to 'linking'
    localStorage.setItem('linking', 'linking');
    // store the currently logged in userid (will be used as primary)
    localStorage.setItem('primary', user.sub);
    // store the provider being connected to
    localStorage.setItem('provider', provider);

    // need to sign in with new IdP
    loginWithRedirect({
      access_type: 'offline', 
      connection: provider,
      redirect_uri: `${window.location.origin}`
    });
  }

  // get the state of the linking state machine
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
      <div className="provider-header">
        <RefreshButton load={loadConnections} loading={loading}/>
        <h4 className="provider-title">{pageTitle}</h4>
      </div>
      { 
        connections && connections.map ? 
        <div>
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
                  action = () => { 
                    setLinkProvider(connection.provider); 
                    setShowModal(true);
                  };
                  buttonText = 'Connect';
                  break;
              }

              return (
                <Card 
                  key={key} 
                  border={ border }
                  style={{ maxWidth: '150px', textAlign: 'center' }}>
                  <center><Card.Img variant="top" src={connection.image} style={{ width: '6rem', marginTop: '20px' }}/></center>
                  <Card.Body>
                    { connected !== 'base' ? 
                    <Button variant={ variant } onClick={ action }>
                      { buttonText }
                    </Button>
                    : <center className='text-success' style={{marginTop: 5}}>Main Login</center>
                    }
                  </Card.Body>
                </Card>
              )
            })
          }
          </CardDeck>

          <Modal show={showModal} onHide={ () => setShowModal(false) }>
            <Modal.Header closeButton>
              <Modal.Title>Linking a new source</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
              To connect to {linkProvider} as a new reputation source, you will need to login  
              to {linkProvider} and allow SaaS Master access to your data.  
              </p>
              <p>
              Note that once your approve these permissions, you will be 
              asked to log in again with your primary login.
              </p>
              <p>
              At the end of the process, you will see data from {linkProvider} as one of your   
              reputation sources!
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={ () => setShowModal(false) }>
                Cancel
              </Button>
              <Button variant="primary" onClick={ () => link(linkProvider) }>
                Link
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        : errorMessage ? 
        <div>
          <i className="fa fa-frown-o"/>
          <span>&nbsp;{errorMessage}</span>
        </div>
        :
        <div />
      }
    </div>
  )
}

export default ConnectionsPage