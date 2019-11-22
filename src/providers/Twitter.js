import React from 'react'
import BaseProvider from './BaseProvider'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'

const TwitterPage = () => {
  return BaseProvider({ 
    pageTitle: 'Twitter mentions',
    connectionName: 'twitter',
    endpoint: 'twitter',
    control: TweetCards
  })
}

const TweetCards = ({data}) => 
  <CardDeck>
  {
    data && data.map ? data.map((item, key) => {
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
    }) 
    : <span>No data to display :)</span>
  }
  </CardDeck>

export default TwitterPage
