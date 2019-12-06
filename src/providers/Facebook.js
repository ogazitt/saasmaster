import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import DataTable from '../components/DataTable';

import { get } from '../utils/api';
import { useAuth0 } from "../utils/react-auth0-wrapper";

const FacebookPage = () => {
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle='Facebook pages'
      connectionName='facebook'
      endpoint='facebook'
      setData={setData}>
      <PageCards data={data} />
    </BaseProvider>
  )
}

const PageCards = ({data}) => {
  const [reviewsData, setReviewsData] = useState();
  const [selected, setSelected] = useState();
  const { getTokenSilently } = useAuth0();

  const getPage = async (key, id, accessToken) => {
    // store the state associated with the selected page
    setSelected(key);

    const token = await getTokenSilently();
    const endpoint = `facebook/reviews/${id}`;
    const headers = {
      token: accessToken
    };
    const [response, error] = await get(token, endpoint, false, headers);

    if (error || !response.ok) {
      setReviewsData(null);
      return;
    }

    const items = await response.json();
    if (items && items.map) {
      const data = items.map(item => {
        return { 
          date: new Date(item.created_time).toLocaleString(),
          type: item.recommendation_type,
          text: item.review_text
        } 
      });
      setReviewsData(data);
    }
  }

  const columns = [{
    dataField: 'date',
    text: 'Date',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '220px' };
    }
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '100px' };
    }
  }, {
    dataField: 'text',
    text: 'Text'    
  }];

  return (
    <div>
      <div style={{ 
        position: "fixed",
        background: "white",
        width: "100%",
        marginTop: "-1px",
        zIndex: 5
      }}>
        <CardDeck>
        {
          data && data.map ? data.map((item, key) => {
            const { name, category_list, id, access_token} = item;
            const category = category_list && category_list[0].name;
            const border = (key === selected) ? 'primary' : 'gray';
          
            const loadPageComments = () => {
              getPage(key, id, access_token);
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
          })
          : <span>No data to display :)</span>
        }
        </CardDeck>
      </div>
      { 
        reviewsData ? 
        <div style={{
          position: "relative", 
          top: 170
        }}>
          <h4>Reviews</h4>
          <DataTable columns={columns} data={reviewsData} keyField="date" />
        </div> :
        <div/>
      }
    </div>
  )
}

export default FacebookPage
