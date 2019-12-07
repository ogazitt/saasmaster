import React, { useState } from 'react'
import DataTable from '../components/DataTable'
import ButtonRow from '../components/ButtonRow'
import Button from 'react-bootstrap/Button'

import { post } from '../utils/api'
import { useAuth0 } from "../utils/react-auth0-wrapper";

const FilterTable = ({
  data,     // raw data array returned from API
  setData,  // setstate method for data
  dataRows, // processed data rows 
  columns,  // columns
  keyField, // key field for both data and dataRows
  path      // API path to call back to update __handled field
}) => {
  const [hiddenRowKeys, setHiddenRowKeys] = useState();
  const [showAll, setShowAll] = useState(false);
  const { getTokenSilently } = useAuth0();

  // build up the list of handled records
  console.log(data);
  let handled = data.filter(r => r.__handled).map(r => r[keyField]);
  console.log(handled);
  const han = data.filter(r => r.__handled === true);
  console.log(`han: ${han}`);
  const newhan = han.map(r => r[keyField]);
  console.log(`newhan: ${newhan}`);

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
        handled.push(row[keyField]);
      } else {
        handled = handled.filter(x => x !== row[keyField]);
      }
    },
    onSelectAll: (isSelect, rows) => {
      const ids = rows.map(r => r[keyField]);
      if (isSelect) {
        handled = ids;
      } else {
        handled = [];
      }
    }
  };
  
  const markRead = async () => {
    const token = await getTokenSilently();
    const ids = dataRows.map(r => r[keyField]);

    // create an object of objects
    // { id1: { __handled: true }, id2: { __handled: false } }
    const dataObj = {};
    for (const entry of ids) {
      const isHandled = handled.find(id => id === entry) ? true : false;
      dataObj[entry] = { __handled: isHandled };

      // adjust the local state of the tweet array
      const row = data.find(r => r[keyField] === entry);
      row.__handled = isHandled;
    }

    // hide the rows that have been marked read 
    // do this before posting the operation to the API in order to 
    // update the display without waiting for the network operation
    setHiddenRowKeys(handled);
    setShowAll(false);
        
    // post to the twitter mentions API that can handle multiple
    // entries at at time
    const [response, error] = await post(token, path, JSON.stringify(dataObj));
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
    dataRows && dataRows.length > 0 ? 
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
            data={dataRows} 
            keyField={keyField} 
            selectRow={selectRow}
            hiddenRows={hiddenRowKeys} /> 
        </div>
      </div> :
      <span>No data to display :)</span>
  )
}

export default FilterTable