import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
import FilterTable from '../components/FilterTable';

const TwitterPage = () => {
  const [data, setData] = useState();

  return (
    <BaseProvider 
      pageTitle='Twitter mentions'
      connectionName='twitter'
      endpoint='twitter'
      setData={setData}>
      <TweetTable data={data} setData={setData}/>
    </BaseProvider>
  )
}

const TweetTable = ({data, setData}) => {
  const urlFormatter = (cell, row) => {
    const tweetId = `https://twitter.com/i/web/status/${row.id}`;
    return <a href={tweetId} target="_">{cell}</a>
  }

  const columns = [{
    dataField: 'date',
    text: 'Date',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '200px' };
    }
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '80px' };
    }
  }, {
    dataField: 'user',
    text: 'User',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '120px' };
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
    text: 'Text',
    formatter: urlFormatter
  }];

  const tweets = data && data.map && data.map(item => {
    const sentiment = parseFloat(item.__sentimentScore);
    const type = sentiment > 0.1 ? 'positive' : 
      sentiment < -0.1 ? 'negative' : 'neutral';

    return {
      id_str: item.id_str,
      date: new Date(item.created_at).toLocaleString(),
      user: item.user.screen_name,
      name: item.user.name,
      type: type,
      text: item.text
    }
  });

  return (
    tweets ? 
      <FilterTable
        data={data}
        setData={setData}
        dataRows={tweets}
        columns={columns}
        keyField="id_str"
        path="twitter/mentions"
        maxHeight="calc(100vh - 220px)"
      /> :
      <div/>
  )
}

export default TwitterPage
