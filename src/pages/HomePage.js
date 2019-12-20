import React, { useState } from 'react'
import Loading from '../components/Loading'
import ProviderFilter from '../components/ProviderFilter'
import PieChart from '../components/PieChart'
import Legend from '../components/Legend'
import RefreshButton from '../components/RefreshButton'

import { useConnections } from '../utils/connections'
import { useMetadata } from '../utils/metadata'

const HomePage = () => {
  //const { loading: loadingConnections, connections } = useConnections();
  //const { loading: loadingMetadata, metadata, loadMetadata } = useMetadata();
  const { loading, metadata, loadMetadata } = useMetadata();
  const [checkboxState, setCheckboxState] = useState();
  const [providers, setProviders] = useState();

  if (!metadata && loading) {
    return <Loading />
  }

  // get the set of unique providers returned in metadata, if haven't yet
  if (!providers && metadata && metadata.length > 0) {
    const list = metadata.map(m => m.provider);
    setProviders([...new Set(list)]);
    return;
  }

  // if there is no metadata / alerts to display, show a message instead
  if (!metadata || !metadata.length > 0) {
    return (
      <div>
        <div className="provider-header">
          <RefreshButton load={loadMetadata} loading={loading}/>
          <h4 className="provider-title">Sentiment dashboard</h4>
        </div>
        {
          metadata && metadata.length === 0 &&
          <span>No sentiment data yet :)</span>
        }
        {
          !metadata && 
          <div>
            <i className="fa fa-frown-o"/>
            <span>&nbsp;Can't reach service - try refreshing later</span>
          </div>
        }
      </div>
    )
  }

  /*
  const loading = loadingConnections || loadingMetadata;
  if (!metadata && loadingMetadata) {
    return <Loading />
  }

  if (!connections && loadingConnections) {
    return <Loading />
  }

  if (!connections || !connections.length > 0 || !metadata) {
  // if there is no data to display, show a message instead
    return (
      <div>
        <div className="provider-header">
          <RefreshButton load={loadMetadata} loading={loading}/>
          <h4 className="provider-title">Sentiment dashboard</h4>
        </div>
        <div>
          <i className="fa fa-frown-o"/>
          <span>&nbsp;Can't reach service - try refreshing later</span>
        </div>
      </div>
    )
  }

  // reduce the provider set to only the connection types that are connected
  const providers = connections.filter(c => c.connected).map(c => c.provider);
  */

  // extract the set of providers that are checked by the ProviderFilter control
  const checkedProviders = checkboxState && providers && providers.filter(p => checkboxState[p].state);

  // extract the set of providers that are checked by the ProviderFilter control
  //const checkedProviders = checkboxState && Object.keys(checkboxState).filter(p => checkboxState[p].state);

  const sentimentValues = ['positive', 'neutral', 'negative'];
  //const colors = ['#E38627', '#C13C37', '#6A2135'];
  const colors = ['#28a745', '#ffc107', '#dc3545'];

  const legend = {
    domain: sentimentValues,
    range: colors
  };

  // compute the pie data across all the providers
  const pieDataAll = checkedProviders && sentimentValues.map((val, index) => {
    return (
      {
        color: colors[index],
        title: val,
        value: metadata.filter(m => 
          m.__sentiment === val && 
          checkedProviders.find(p => p === m.provider))
          .length
      }
    )
  });

  const providerPieDataArray = checkedProviders && checkedProviders.map(p => {
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
        <RefreshButton load={loadMetadata} loading={loading}/>
        <h4 className="provider-title">Sentiment dashboard</h4>
        <div style={{ marginLeft: 50 }}>
          <ProviderFilter 
            providers={providers}
            checkboxState={checkboxState}
            setCheckboxState={setCheckboxState}
            />
        </div>
      </div>
      <div style={{ display: 'flex', overflowX: 'hidden' /* horizontal layout */ }}> 
        <div style={{ marginLeft: 25 /* vertical layout */}}>
          <div style={{ height: 50, marginTop: 25, marginLeft: 10 }}>
            <center>
              <Legend scale={legend}/>
            </center>
          </div>
          <div style={{ display: 'flex' /* horizontal layout of charts */ }}>
            <div style={{ margin: 10 }}>
              <PieChart 
                data={pieDataAll} 
                radius={50} 
                style={{ height: '300px', width: '300px' }}
                />
              <center className="text-muted" style={{ marginTop: 3, fontSize: '1.75em', fontWeight: 'bold' }}>All</center>
            </div>
            <div style={{ display: 'flex', marginTop: 75, marginLeft: 25 }}>
            { 
              providerPieDataArray && providerPieDataArray.length > 0 && providerPieDataArray.map(p => 
                <div style={{ margin: 10 }} key={p.providerName}>
                  <PieChart 
                    data={p.pieData}
                    radius={50}
                    style={{ height: '150px', width: '150px' }}
                    />
                  <center style={{ marginTop: 10 }}>
                    <i className={`fa fa-fw fa-${p.providerName} text-muted`} style={{ fontSize: '1.75em' }} />
                  </center>
                </div>
              )
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

