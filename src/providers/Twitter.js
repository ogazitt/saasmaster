import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
import DataTable from '../components/DataTable';

const TwitterPage = () => {
  const [data, setData] = useState();
  return (
    <BaseProvider 
      pageTitle='Twitter mentions'
      connectionName='twitter'
      endpoint='twitter'
      setData={ setData }>
        <TweetTable data={data}/>
    </BaseProvider>
  )
}

const TweetTable = ({data}) => {
  const columns = [{
    dataField: 'date',
    text: 'Date',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '220px' };
    }
  }, {
    dataField: 'user',
    text: 'User',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '100px' };
    }
  }, {
    dataField: 'name',
    text: 'Name',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '100px' };
    }
  }, {
    dataField: 'text',
    text: 'Text'    
  }];

  const tweets = data && data.map && data.map(item => {
    return {
      date: new Date(item.created_at).toLocaleString(),
      user: item.user.screen_name,
      name: item.user.name,
      text: item.text
    }
  });

  return (
    tweets && tweets.length > 0 ? 
      <DataTable columns={columns} data={tweets} keyField="date" /> :
      <span>No data to display :)</span>
  )
}

export default TwitterPage
