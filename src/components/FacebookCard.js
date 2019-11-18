import React from 'react'
import Card from 'react-bootstrap/Card'

const FacebookCard = ({item, key}) => {
  const { name, category_list } = item;
  const category = category_list && category_list[0].name;
  return (
    <Card 
      key={key} 
      style={{ maxWidth: '150px', textAlign: 'center' }}>
      <Card.Body>
        <Card.Title className="text-center">{ name }</Card.Title>
        <Card.Subtitle className="text-center">{ category }</Card.Subtitle>
      </Card.Body>
    </Card>    
  )
}

export default FacebookCard