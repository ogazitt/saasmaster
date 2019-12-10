import React, { useState } from 'react'
import Loading from '../components/Loading'
import CheckboxGroup from '../components/CheckboxGroup'
import PieChart from '../components/PieChart'
import Legend from '../components/Legend'
import { useConnections } from '../utils/connections'
//import { useAuth0 } from '../utils/react-auth0-wrapper'

const HomePage = () => {
  // const { loading, user } = useAuth0();
  const { loading, connections } = useConnections();
  const [state, setState] = useState();

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

  // if haven't initialized the state yet, set it now
  if (!state) {
    // create item list - one for each connection
    const items = {};
    for (const c of connections) {
      // take first element of name in the format like google-oauth2
      const [providerName] = c.provider.split('-');
      items[providerName] = { 
        name: `dashboardCB-${providerName}`,
        state: c.connected ? true : false
      }
    }
    setState(items);
  }
  
  // event handler for checkbox group
  const onSelect = (event) => {
    // make a copy of state
    const items = { ...state };

    // checkbox name is in the form `dashboardCB-${name}`
    const name = event.target.name && event.target.name.split('-')[1];
    if (name && items[name]) {
      items[name].state = !items[name].state;
      setState(items);
    }
  }

  const legend = {
    domain: ['positive', 'neutral', 'negative'],
    range: ['#E38627', '#C13C37', '#6A2135']
   //range: ['#66d981', '#71f5ef', '#4899f1', '#7d81f6']
  }

  const pieData = [
    {
      color: '#E38627',
      title: 'One',
      value: 10
    },
    {
      color: '#C13C37',
      title: 'Two',
      value: 15
    },
    {
      color: '#6A2135',
      title: 'Three',
      value: 20
    }
  ];

  const providers = state && Object.keys(state).filter(p => state[p].state);

  return (
    <div>
      <div className="provider-header">
        <h4>Sentiment Dashboard</h4>
      </div>
      <div style={{ display: 'flex', overflowX: 'hidden' /* horizontal layout */ }}> 
        <div style={{ marginTop: 50 }}>
          <CheckboxGroup 
            state={state}
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
            <PieChart data={pieData}/>
            <center style={{ marginTop: 10 }}>All</center>
          </div>

          { 
            providers && providers.length > 0 && providers.map(p => 
              <div style={{ margin: 10 }}>
                <PieChart data={pieData}/>
                <center style={{ marginTop: 10 }}>{p}</center>
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

