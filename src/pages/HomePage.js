import React, { useState } from 'react'
import Loading from '../components/Loading'
import CheckboxGroup from '../components/CheckboxGroup'
import PieChart from '../components/PieChart'
import Legend from '../components/Legend'
import Button from 'react-bootstrap/Button'

import { useConnections } from '../utils/connections'
import { useMetadata } from '../utils/metadata'

const HomePage = () => {
  const { loading: loadingConnections, connections } = useConnections();
  const { loading: loadingMetadata, metadata, loadMetadata } = useMetadata();
  const [checkboxState, setCheckboxState] = useState();

  const loading = loadingConnections || loadingMetadata;
  if (!metadata && loadingMetadata) {
    return <Loading />
  }

  if (!connections && loadingConnections) {
    return <Loading />
  }

  /*
  if (loadingConnections || loadingMetadata) {
    return <Loading />
  }
  */
  
  if (!connections || !connections.length > 0 || !metadata) {
    return (
      <div className="provider-header">
        <h4>
          <i className="fa fa-frown-o"/>
          <span>&nbsp;Can't reach service - try refreshing later</span>
        </h4>
      </div>
    )
  }

  // if haven't initialized the state yet, set it now
  if (!checkboxState) {
    // create item list - one for each connection
    const items = {};
    for (const c of connections) {
      // take first element of name in the format like google-oauth2
      const providerName = c.provider;
      const [providerTitle] = providerName.split('-');
      items[providerName] = { 
        name: `dashboardCB-${providerName}`,
        title: providerTitle,
        state: c.connected ? true : false
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

  const providers = checkboxState && Object.keys(checkboxState).filter(p => checkboxState[p].state);

  const providerPieDataArray = providers && providers.map(p => {
    const array = sentimentValues.map((val, index) => {
      return (
        {
          color: colors[index],
          title: val,
          value: metadata.filter(m => m.provider === p && m.__sentiment === val).length
        }
      )
    });
    return {
      providerName: checkboxState[p].title,
      pieData: array
    }
  });

  return (
    <div>
      <div className="provider-header">
        <Button onClick={loadMetadata}>
          <i className={ loading ? "fa fa-spinner" : "fa fa-refresh" }></i>
        </Button>
        <h4 className="provider-title">Sentiment dashboard</h4>
      </div>
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
                  {/*p.providerName*/}
                </center>
              </div>
            )
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

