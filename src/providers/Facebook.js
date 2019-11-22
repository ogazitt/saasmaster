import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
import Card from 'react-bootstrap/Card'
//import CardDeck from 'react-bootstrap/CardDeck';

import callApi from '../utils/callApi';
import { useAuth0 } from "../utils/react-auth0-wrapper";
import DataTable from '../components/DataTable';

const FacebookPage = () => {
  const [data, setData] = useState();
  const [selected, setSelected] = useState();
  //const [pageId, setPageId] = useState();
  const { getTokenSilently } = useAuth0();

  const getPage = async (key, id, accessToken) => {
    // store the state associated with the selected page
    setSelected(key);
    //setPageId(id);

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

    const items = await response.json();
    if (items) {
      const data = items.map((item, key) => {
        const date = new Date(item.created_time).toLocaleString();
        return { 
          key, 
          date,
          type: item.recommendation_type,
          text: item.review_text
        } 
      });
      setData(data);
    }
  }

  const columns = [{
    dataField: 'date',
    text: 'Date',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '220px' };
    }
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '100px' };
    }
  }, {
    dataField: 'text',
    text: 'Text'    
  }];
  
  return (
    <div>
      <BaseProvider 
        pageTitle='Facebook pages'
        connectionName='facebook'
        onLoadHandler={ () => { setData(null); setSelected(null) }}
        endpoint='facebook'
        card={FacebookCard}
        onClickHandler={getPage}
        selected={selected}>          
      </BaseProvider>
      <br/>
      { data && data.length > 0 ? 
        /*
        <CardDeck>
        {
          data.map((item, key) => ReviewCard({ item, key, id: pageId }))
        }
        </CardDeck>
        */
        <div>
          <h4>Reviews</h4>
          <DataTable columns={columns} data={data} keyField="date" />
        </div>
      : <div/>
      }
    </div>
  )
}

const FacebookCard = ({item, key, onClickHandler, selected}) => {
  const { name, category_list, id, access_token} = item;
  const category = category_list && category_list[0].name;
  const border = (key === selected) ? 'primary' : 'gray';

  const loadPageComments = () => {
    onClickHandler(key, id, access_token);
  }

  return (
    <Card className="text-center" onClick={ loadPageComments }
      key={key} border={border}
      style={{ maxWidth: '250px' }}>
      <Card.Header>{ name }</Card.Header>
      <Card.Body>
        <Card.Title>{ category }</Card.Title>
        <Card.Link href={`https://www.facebook.com/${id}`} target="_blank">Link to page</Card.Link>
        <Card.Link href={`https://www.facebook.com/${id}/reviews`} target="_blank">Link to reviews</Card.Link>
      </Card.Body>
    </Card>    
  )
}

const ReviewCard = ({item, key, id}) => {
  const date = new Date(item.created_time).toLocaleString();
  const border = (item.recommendation_type === 'positive' ? 'success' : 
                 item.recommendation_type === 'negative' ? 'danger' : 'gray');
  return(
    <Card key={ key } style={{ maxWidth: '400px' }} border={ border } text={ border }>
      <Card.Header>{date}</Card.Header>
      <Card.Body>
        <Card.Text>{item.review_text}</Card.Text>
        <Card.Link href={`https://www.facebook.com/${id}/reviews`} target="_blank">Link to review</Card.Link>
      </Card.Body>
    </Card>
  )
}

export default FacebookPage
