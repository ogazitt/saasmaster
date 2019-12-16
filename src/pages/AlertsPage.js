import React, { useState } from 'react'
import Loading from '../components/Loading'
import DataTable from '../components/DataTable'
import CheckboxGroup from '../components/CheckboxGroup'
import RefreshButton from '../components/RefreshButton'
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
    setProviders([... new Set(list)]);
    return;
  }

  // if haven't initialized the state yet, set it now
  if (!checkboxState && providers && providers.length > 0) {
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

  // can't proceed until we've created the checkboxState
  if (!checkboxState) {
    return;
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
  const checkedProviders = providers && providers.filter(p => checkboxState[p].state);

  // create the alerts array, which only contains unhandled entries of checked providers
  const alerts = metadata && metadata.map && 
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
          <CheckboxGroup 
            state={checkboxState}
            onSelect={onSelect}
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