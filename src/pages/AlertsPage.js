import React, { useState } from 'react'
import Loading from '../components/Loading'
import DataTable from '../components/DataTable'
import RefreshButton from '../components/RefreshButton'
import ProviderFilter from '../components/ProviderFilter'
import { navigate } from 'hookrouter'
import { useMetadata } from '../utils/metadata'

const AlertsPage = () => {
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
  if (!loading && metadata && !metadata.length > 0) {
    return (
      <div className="provider-header">
        <h4>
          <span>No alerts yet :)</span>
        </h4>
      </div>
    )
  }

  const formatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <i className={ formatExtraData[cell] } />
    )
  }

  const columns = [{
    dataField: 'provider',
    text: 'Source',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '100px' };
    },
    align: 'center',
    formatter: formatter,
    formatExtraData: {
      facebook: 'fa fa-facebook fa-2x text-muted',
      twitter: 'fa fa-twitter fa-2x text-muted',
      'google-oauth2': 'fa fa-google fa-2x text-muted',
      instagram: 'fa fa-instagram fa-2x text-muted'
    }
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: '80px' };
    },
    align: 'center',
    formatter: formatter,
    formatExtraData: {
      positive: 'fa fa-thumbs-up fa-2x text-success',
      neutral: 'fa fa-minus fa-2x text-warning',
      negative: 'fa fa-thumbs-down fa-2x text-danger'
    }
  }, {
    dataField: 'text',
    text: 'Text'
  }];

  // create the checked providers array
  const checkedProviders = checkboxState && providers && providers.filter(p => checkboxState[p].state);

  // create the alerts array, which only contains unhandled entries of checked providers
  const alerts = checkedProviders && metadata && metadata.map && 
    metadata
      .filter(a => a.__handled !== true && checkedProviders.find(p => p === a.provider))
      .map(item => {
    return {
      id: item.id, 
      type: item.__sentiment,
      provider: item.provider, 
      text: item.text,
      handled: item.__handled
    }
  });

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate(`/business/${row.provider}`);
    }
  };

  return (
    <div>
      <div className="provider-header">
        <RefreshButton load={loadMetadata} loading={loading}/>
        <h4 className="provider-title">Unhandled feedback</h4>
        <div style={{ marginLeft: 50 }}>
          <ProviderFilter 
            providers={providers}
            checkboxState={checkboxState}
            setCheckboxState={setCheckboxState}
            />
        </div>
      </div>
      { 
        alerts ? 
        <DataTable
          columns={columns}
          data={alerts}
          keyField="id"
          rowEvents={rowEvents}
        /> :
        <div/>
      }
    </div>
  )
}

export default AlertsPage