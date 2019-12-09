import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import FilterTable from '../components/FilterTable'

import { get } from '../utils/api'
import { useAuth0 } from '../utils/react-auth0-wrapper'

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
  const [reviews, setReviews] = useState();
  const [selected, setSelected] = useState();
  const { getTokenSilently } = useAuth0();

  const getPage = async (id, accessToken) => {
    // store the state associated with the selected page
    setSelected(id);

    const token = await getTokenSilently();
    const endpoint = `facebook/reviews/${id}`;
    const headers = {
      token: accessToken
    };
    const [response, error] = await get(token, endpoint, false, headers);

    if (error || !response.ok) {
      setReviewsData(null);
      setReviews(null);
      return;
    }

    const items = await response.json();
    if (items && items.map) {
      setReviewsData(items);
      const data = items.map(item => {
        return { 
          created_time: item.created_time,
          date: new Date(item.created_time).toLocaleString(),
          type: item.recommendation_type,
          text: item.review_text
        } 
      });
      setReviews(data);
    }
  }

  const typeFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <i className={ formatExtraData[cell] } />
    )
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
    },
    align: 'center',
    formatter: typeFormatter,
    formatExtraData: {
      positive: 'fa fa-thumbs-up fa-2x text-success',
      neutral: 'fa fa-minus fa-2x',
      negative: 'fa fa-thumbs-down fa-2x text-danger'
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
        height: "151px",
        zIndex: 5
      }}>
        <CardDeck>
        {
          data && data.map ? data.map((item, key) => {
            const { name, category_list, id, access_token} = item;
            const category = category_list && category_list[0].name;
            const border = (id === selected) ? 'primary' : 'gray';
          
            const loadPageComments = () => {
              getPage(id, access_token);
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
          position: "fixed", 
          top: 310
        }}>
          <div style={{
            position: "sticky",
            top: 0
          }}>
            <h4>Reviews</h4>
          </div>
          <FilterTable
            data={reviewsData}
            setData={setReviewsData}
            dataRows={reviews}
            columns={columns}
            keyField="created_time"
            path={`facebook/reviews/${selected}`}
            maxHeight="calc(100vh - 420px)"
            />
        </div> :
        <div/>
      }
    </div>
  )
}

export default FacebookPage
