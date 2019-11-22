import React from 'react'
import BaseProvider from './BaseProvider'
import Card from 'react-bootstrap/Card'

const InstagramPage = () => {
  return BaseProvider({ 
    pageTitle: 'Instagram posts',
    connectionName: 'instagram',
    endpoint: 'instagram',
    card: InstagramCard
  })
}

const InstagramCard = ({item, key}) => {
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

export default InstagramPage