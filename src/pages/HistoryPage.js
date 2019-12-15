import React, { useState } from 'react'
import Loading from '../components/Loading'
import Highlight from '../components/Highlight'
import CheckboxGroup from '../components/CheckboxGroup'
import Legend from '../components/Legend'

import { useAuth0 } from '../utils/react-auth0-wrapper'
import { get } from '../utils/api'
import Button from 'react-bootstrap/Button'

const HistoryPage = () => {
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [checkboxState, setCheckboxState] = useState();

  const { getTokenSilently } = useAuth0();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // force load of history data
  const loadData = async () => { 
    setLoading(true);

    const token = await getTokenSilently();
    const [response, error] = await get(token, 'history');

    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setHistory(null);
      return;
    }

    const responseData = await response.json();
    setLoadedData(true);
    setLoading(false);
    setHistory(responseData);
  };

  // if haven't loaded profile yet, do so now
  if (!loadedData) {
    loadData();
    return <Loading />
  }

  if (!history || !history.length > 0) {
    return (
      <div className="provider-header">
        <h4>
          <i className="fa fa-frown-o"/>
          <span>&nbsp;No history yet :)</span>
        </h4>
      </div>
    )
  }
  console.log(history);

  // get the set of unique providers returned in metadata
  const providerSet = new Set();
  for (const h of history) {
    const keys = Object.keys(h).filter(k => k !== 'timestamp');
    keys.forEach(providerSet.add, providerSet);
  }
  const providers = Array.from(providerSet);
  console.log(providers);

  // if haven't initialized the state yet, set it now
  if (!checkboxState) {
    // create item list - one for each connection
    const items = {};
    for (const p of providers) {
      // take first element of name in the format like google-oauth2
      const [providerTitle] = p.split('-');
      items[p] = { 
        name: `dashboardCB-${p}`,
        title: providerTitle,
        state: true
      }
    }
    setCheckboxState(items);
  }

  // event handler for checkbox group
  const onSelect = (event) => {
    // make a copy of state
    const items = { ...checkboxState };

    // checkbox name is in the form `dashboardCB-${name}`
    const name = event.target.name && event.target.name.split('dashboardCB-')[1];
    if (name && items[name]) {
      items[name].state = !items[name].state;
      setCheckboxState(items);
    }
  }

  const sentimentValues = ['positive', 'neutral', 'negative'];
  //const colors = ['#E38627', '#C13C37', '#6A2135'];
  const colors = ['#28a745', '#ffc107', '#dc3545'];

  const legend = {
    domain: sentimentValues,
    range: colors
  };

  /*
  // compute the pie data
  const pieDataAll = sentimentValues.map((val, index) => {
    return (
      {
        color: colors[index],
        title: val,
        value: metadata.filter(m => m.__sentiment === val).length
      }
    )
  });
  */

  //const providers = checkboxState && Object.keys(checkboxState).filter(p => checkboxState[p].state);

  return(
    <div>
      <div className="provider-header">
        <Button onClick={loadData}><i className="fa fa-refresh"></i></Button>
        <h4 className="provider-title">Sentiment history</h4>
      </div>
      { 
        loadedData ? <Highlight>{JSON.stringify(history, null, 2)}</Highlight> : <div/>
      }

      <div style={{ display: 'flex', overflowX: 'hidden' /* horizontal layout */ }}> 
        <div style={{ marginTop: 50 }}>
          <CheckboxGroup 
            state={checkboxState}
            onSelect={onSelect}
          />
        </div>
        <div style={{ marginLeft: 25 /* vertical layout */}}>
          <div style={{ height: 50, marginLeft: 50 }}>
            <center>
              <Legend scale={legend}/>
            </center>
          </div>
          <div style={{ display: 'flex' /* horizontal layout of charts */ }}>
          {/*
          <div style={{ margin: 10 }}>
            <PieChart data={pieDataAll}/>
            <center className="text-muted" style={{ marginTop: 3, fontSize: '1.75em', fontWeight: 'bold' }}>All</center>
          </div>
          { 
            providerPieDataArray && providerPieDataArray.length > 0 && providerPieDataArray.map(p => 
              <div style={{ margin: 10 }} key={p.providerName}>
                <PieChart data={p.pieData}/>
                <center style={{ marginTop: 10 }}>
                  <i className={`fa fa-fw fa-${p.providerName} text-muted`} style={{ fontSize: '1.75em' }} />
                </center>
              </div>
            )
          }*/}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage