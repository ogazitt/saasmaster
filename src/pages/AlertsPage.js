import React from 'react'
import Loading from '../components/Loading'
import DataTable from '../components/DataTable'
import Button from 'react-bootstrap/Button'
import { navigate } from 'hookrouter'
import { useMetadata } from '../utils/metadata'

const AlertsPage = () => {
  const { loading, metadata, loadMetadata } = useMetadata();

  if (!metadata && loading) {
    return <Loading />
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

  const alerts = metadata && metadata.map && 
    metadata.filter(a => a.__handled !== true).map(item => {
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
        <Button onClick={loadMetadata}>
          <i className={ loading ? "fa fa-spinner" : "fa fa-refresh" }></i>
        </Button>
        <h4 className="provider-title">Unhandled feedback</h4>
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