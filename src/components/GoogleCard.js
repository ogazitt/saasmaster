import React from 'react'
import Card from 'react-bootstrap/Card'

const GoogleCard = ({item, key}) => {
  const { summary, backgroundColor } = item
  return (
    <Card 
      key={key} 
      style={{ maxWidth: '150px', textAlign: 'center', color: backgroundColor }}>
      <Card.Body>
        <Card.Title className="text-center">{ summary }</Card.Title>
      </Card.Body>
    </Card>    
  )
}

export default GoogleCard