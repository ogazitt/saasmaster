import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck';

import callApi from '../utils/callApi';
import { useAuth0 } from "../utils/react-auth0-wrapper";

const FacebookPage = () => {
  const [data, setData] = useState();
  const [selected, setSelected] = useState();
  const { getTokenSilently } = useAuth0();

  const getPage = async (key, id, accessToken) => {
    setSelected(key);

    const token = await getTokenSilently();
    const endpoint = `facebook/reviews/${id}`;
    const headers = {
      token: accessToken
    };
    const [response, error] = await callApi(token, endpoint, headers);

    if (error || !response.ok) {
      setData(null);
      return;
    }

    const responseData = await response.json();
    const items = responseData && responseData.data;
    setData(items);
  }

  return (
    <div>
      <BaseProvider 
        providerName='Facebook'
        connectionName='facebook'
        endpoint='facebook'
        dataIndex='data'
        card={FacebookCard}
        func={getPage}
        selected={selected}>          
      </BaseProvider>
      <br/>
      { data ? 
        <CardDeck>
        {
          data.map((item, key) => ReviewCard({ item, key }))
        }
        </CardDeck>
      : <div/>
      }
    </div>
  )
}

const FacebookCard = ({item, key, func, selected}) => {
  const { name, category_list, id, access_token} = item;
  const category = category_list && category_list[0].name;
  const backColor = (key === selected) ? 'green' : 'black';

  const loadPageComments = () => {
    func(key, id, access_token);
  }

  return (
    <Card className="text-center" onClick={ loadPageComments }
      key={key} 
      style={{ maxWidth: '200px', textAlign: 'center', color: backColor }}>
      <Card.Header>{ name }</Card.Header>
      <Card.Body>
        <Card.Title>{ category }</Card.Title>
      </Card.Body>
    </Card>    
  )
}

const ReviewCard = ({item, key}) => {
  const date = new Date(item.created_time).toLocaleString();
  return(
    <Card style={{ maxWidth: '400px' }}>
      <Card.Header>{date}</Card.Header>
      <Card.Body>
        <Card.Title>{item.recommendation_type}</Card.Title>
        <Card.Text>{item.review_text}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default FacebookPage
