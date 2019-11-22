import React from 'react'
import BaseProvider from './BaseProvider'
import Card from 'react-bootstrap/Card'

const TwitterPage = () => {
  return BaseProvider({ 
    pageTitle: 'Twitter mentions',
    connectionName: 'twitter',
    endpoint: 'twitter',
    card: TwitterCard
  })
}

const TwitterCard = ({item, key}) => {
  const { text, user } = item;
  return (
    <Card 
      key={key} 
      style={{ maxWidth: '150px', textAlign: 'center' }}>
      <Card.Body>
        <Card.Title className="text-center">{ user.name }</Card.Title>
        <Card.Subtitle className="text-center">{ text }</Card.Subtitle>
      </Card.Body>
    </Card>    
  )
}

export default TwitterPage
