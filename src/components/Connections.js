import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck';

import { useConnections } from '../utils/connections';

const Connections = () => {
  const { connections, loaded } = useConnections();

  if (!loaded) {
    return (<div>Error encountered loading connections :(  Please try refreshing!</div>)
  }
  
  return (
    <CardDeck>
    {
      connections.map((connection, key) => {
        const connected = connection.connected;
        return (
          <Card 
            key={key} 
            border={ connected ? 'success' : 'secondary' }
            style={{ maxWidth: '150px', textAlign: 'center' }}>
            <center><Card.Img variant="top" src={connection.image} style={{ width: '8rem', marginTop: '10px' }}/></center>
            <Card.Body>
              <Card.Title className="text-center">{connection.provider}</Card.Title>
              <Button variant={ connected ? 'danger' : 'primary' }>
                { connected ? 'Disconnect' : 'Connect'}
              </Button>
            </Card.Body>
          </Card>    
        )
      })
    }
    </CardDeck>
  );
};

export default Connections;