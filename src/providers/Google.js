import React from 'react'
import BaseProvider from './BaseProvider'
import Card from 'react-bootstrap/Card'

const GooglePage = () => {
  return BaseProvider({ 
    pageTitle: 'Google calendars',
    connectionName: 'google-oauth2',
    endpoint: 'google',
    card: GoogleCard
  })
}

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

export default GooglePage