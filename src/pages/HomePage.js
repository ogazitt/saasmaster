import React, { useState } from 'react'
import Loading from '../components/Loading'
import CheckboxGroup from '../components/CheckboxGroup'
import PieChart from '../components/PieChart'
import Legend from '../components/Legend'
import { useConnections } from '../utils/connections'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { get } from '../utils/api'

const HomePage = () => {
  const [loadMetadata, setLoadMetadata] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const [metadata, setMetadata] = useState();
  const [checkboxState, setCheckboxState] = useState();

  const { getTokenSilently } = useAuth0();
  const { loading, connections } = useConnections();

  if (loading) {
    return <Loading />
  }

  if (!connections || !connections.length > 0) {
    return (
      <div className="provider-header">
        <h4>
          <i className="fa fa-frown-o"/>
          <span>&nbsp;Can't reach service - try refreshing later</span>
        </h4>
      </div>
    )
  }

  // function to load metadata from service
  const retrieveMetadata = async() => {
    setLoadMetadata(false);

    const token = await getTokenSilently();
    const [response, error] = await get(token, 'metadata');

    if (error || !response.ok) {
      setMetadata(null);
      setErrorMessage("Can't reach server - try refreshing later");
      return;
    }

    // items always come back as an array
    const items = await response.json();

    setErrorMessage(null);
    setMetadata(items);
  }

  // invoke the load metadata function if we haven't done so yet
  if (loadMetadata) {
    retrieveMetadata();
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
  const colors = ['#E38627', '#C13C37', '#6A2135'];
  const legend = {
    domain: sentimentValues,
    range: colors
  };

  // normalize the metadata score values into the [sentimentValues] range
  const normalizedMD = metadata && metadata.map(item => {
    const provider = item.provider;
    const sentiment = parseFloat(item.__sentimentScore);
    const type = sentiment > 0.1 ? sentimentValues[0] : 
      sentiment < -0.1 ? sentimentValues[2] : sentimentValues[1];
    return { provider, type };
  });

  // compute the pie data
  const pieDataAll = normalizedMD && sentimentValues.map((val, index) => {
    return (
      {
        color: colors[index],
        title: val,
        value: normalizedMD.filter(m => m.type === val).length
      }
    )
  });

  const providers = checkboxState && Object.keys(checkboxState).filter(p => checkboxState[p].state);

  const providerPieDataArray = normalizedMD && providers && providers.map(p => {
    const array = sentimentValues.map((val, index) => {
      return (
        {
          color: colors[index],
          title: val,
          value: normalizedMD.filter(m => m.provider === p && m.type === val).length
        }
      )
    });
    return {
      providerName: checkboxState[p].title,
      pieData: array
    }
  });

  console.log(providerPieDataArray);
  return (
    metadata ?
    <div>
      <div className="provider-header">
        <h4>Sentiment Dashboard</h4>
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
            <center style={{ marginTop: 10 }}>All</center>
          </div>

          { 
            providerPieDataArray && providerPieDataArray.length > 0 && providerPieDataArray.map(p => 
              <div style={{ margin: 10 }}>
                <PieChart data={p.pieData}/>
                <center style={{ marginTop: 10 }}>{p.providerName}</center>
              </div>
            )
          }
          </div>
        </div>
      </div>
    </div>
    : errorMessage ? 
    <div className="provider-header">
      <h4>
        <i className="fa fa-frown-o"/>
        <span>&nbsp;Can't reach service - try refreshing later</span>
      </h4>
    </div>
    :
    <div />
  )
}

export default HomePage

