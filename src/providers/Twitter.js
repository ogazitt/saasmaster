import React, { useState } from 'react'
import BaseProvider from './BaseProvider'
import DataTable from '../components/DataTable'
import ButtonRow from '../components/ButtonRow'
import Button from 'react-bootstrap/Button'

import { post } from '../utils/api'
import { useAuth0 } from "../utils/react-auth0-wrapper";

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
  const [hiddenRowKeys, setHiddenRowKeys] = useState();
  const [showAll, setShowAll] = useState(false);
  const { getTokenSilently } = useAuth0();

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

  // build up the list of handled records
  let handled = [];

  const tweets = data && data.map && data.map(item => {
    const sentiment = parseFloat(item.__sentimentScore);
    const type = sentiment > 0.1 ? 'positive' : 
      sentiment < -0.1 ? 'negative' : 'neutral';

    if (item.__handled) {
      handled.push(item.id_str);
    }
    
    return {
      id: item.id_str,
      date: new Date(item.created_at).toLocaleString(),
      user: item.user.screen_name,
      name: item.user.name,
      type: type,
      text: item.text
    }
  });

  // if the hidden row keys array doesn't yet exist, initialize it
  if (handled.length > 0 && !hiddenRowKeys) {
    setHiddenRowKeys(handled);
  }  

  const selectRow = { 
    mode: 'checkbox', 
    clickToSelect: true,
    selected: handled,
    onSelect: (row, isSelect) => {
      if (isSelect) {
        handled.push(row.id);
      } else {
        handled = handled.filter(x => x !== row.id);
      }
    },
    onSelectAll: (isSelect, rows) => {
      const ids = rows.map(r => r.id);
      if (isSelect) {
        handled = ids;
      } else {
        handled = [];
      }
    }
  };

  const markRead = async () => {
    const token = await getTokenSilently();

    const ids = tweets.map(t => t.id);

    // create an object of objects
    // { id1: { __handled: true }, id2: { __handled: false } }
    const dataObj = {};
    for (const entry of ids) {
      const isHandled = handled.find(id => id === entry) ? true : false;
      dataObj[entry] = { __handled: isHandled };

      // adjust the local state of the tweet array
      const tweet = data.find(t => t.id_str === entry);
      tweet.__handled = isHandled;
    }

    // hide the rows that have been marked read 
    // do this before posting the operation to the API in order to 
    // update the display without waiting for the network operation
    setHiddenRowKeys(handled);
    setShowAll(false);
        
    // post to the twitter mentions API that can handle multiple
    // entries at at time
    const [response, error] = await post(token, 'twitter/mentions', JSON.stringify(dataObj));
    if (error || !response.ok) {
      return;
    }

    // retrieve the new dataset, which will trigger a repaint
    const items = await response.json();
    setData(items);
  }

  const toggleShow = () => {
    // if already showing all records, flip the state, don't show handled
    if (showAll) {
      setHiddenRowKeys(handled);
      setShowAll(false);
    } else {
      setHiddenRowKeys([]);
      setShowAll(true);
    }
  }

  return (
    tweets && tweets.length > 0 ? 
      <div>
        <ButtonRow>
          <Button onClick={ markRead }>Mark Checked as Handled</Button>
          <Button onClick={ toggleShow }>{ showAll ? "Hide Handled" : "Show All" }</Button>
        </ButtonRow>
        <div style={{
          position: "relative",
          top: 60,
          overflow: "auto",
          maxHeight: `calc(100vh - 220px)`        
        }}>
          <DataTable 
            columns={columns} 
            data={tweets} 
            keyField="id" 
            selectRow={selectRow}
            hiddenRows={hiddenRowKeys} /> 
        </div>
      </div> :
      <span>No data to display :)</span>
  )
}

export default TwitterPage
