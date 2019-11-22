import React from 'react'
import BaseProvider from './BaseProvider'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'

const InstagramPage = () => {
  return BaseProvider({ 
    pageTitle: 'Instagram posts',
    connectionName: 'instagram',
    endpoint: 'instagram',
    control: InstagramCards
  })
}

const InstagramCards = ({data}) => 
  <CardDeck>
  {
    data && data.map ? data.map((item, key) => {
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
    })
    : <span>No data to display :)</span>
  }
  </CardDeck>

export default InstagramPage