import React, { useState } from 'react'
import { navigate } from 'hookrouter'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { get } from '../utils/api'
import Loading from '../components/Loading'
import Button from 'react-bootstrap/Button'

const BaseProvider = ({ 
    pageTitle, 
    connectionName, 
    endpoint, 
    onLoadHandler,
    setData,
    children
  }) => {

  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [refresh, setRefresh] = useState(false);
  const { getTokenSilently } = useAuth0();
  const { connections } = useConnections();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading && !refresh) {
    return <Loading />
  }
  
  // load data from provider
  const loadData = async (forceRefresh = false) => { 
    setLoading(true);
    setRefresh(true);

    // invoke the on load handler function if supplied by provider
    onLoadHandler && onLoadHandler();

    const token = await getTokenSilently();
    const [response, error] = await get(token, endpoint, forceRefresh);

    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setData(null);
      setRefresh(false);
      setErrorMessage("Can't reach service - try refreshing later");
      return;
    }

    // items always come back as an array
    const items = await response.json();

    setLoadedData(true);
    setLoading(false);
    setErrorMessage(null);
    setRefresh(false);
    setData(items);
  }

  // if connections not loaded, set an error message
  if (!connections || !connections.find) {
    return(
      <div className="provider-header">
        <i className="fa fa-frown-o"/>
        <span>&nbsp;Can't reach service - try refreshing later</span>
      </div>
    )
  }

  // find whether we are connected to the provider
  const connection = connections.find(el => el.provider === connectionName);
  if (!connection || !connection.connected) {
    // need to connect first
    const [provider] = pageTitle.split(' ');
    return(
      <div>
        <br/>
        <Button onClick={ () => { navigate('/business/conns') }}>
          {`Connect to ${provider}`} 
        </Button>
      </div>
    )
  }

  // if haven't loaded data yet, do so now
  if (!loadedData && !loading) {
    loadData();
  }

  return(
    <div>
      <div className="provider-header">
        <Button onClick={() => { loadData(true) }}>
          <i className={ refresh ? "fa fa-spinner" : "fa fa-refresh" }></i>
        </Button>
        <h4 className="provider-title">{pageTitle}</h4>
      </div>
      <div>
      { errorMessage ? <span>{errorMessage}</span> : children }
      </div>
    </div>
  )
}

export default BaseProvider