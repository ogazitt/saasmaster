import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';

const ConnectionCard = ({item, key}) => {
  const connected = item.connected;
  const uid = `${item.provider}|${item.userId}`;
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
      action = () => { link(item.provider) };
      buttonText = 'Connect';
      break;
  }

  return (
    <Card 
      key={key} 
      border={ border }
      style={{ maxWidth: '150px', textAlign: 'center' }}>
      <center><Card.Img variant="top" src={item.image} style={{ width: '8rem', marginTop: '10px' }}/></center>
      <Card.Body>
        { connected !== 'base' ? 
         <Button variant={ variant } onClick={ action }>
           { buttonText }
         </Button>
         : <center>Base Identity</center>
         }
      </Card.Body>
    </Card>    
  )
}

export default ConnectionCard