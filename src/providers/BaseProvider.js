import React, { useState } from 'react';
import { navigate } from 'hookrouter';
import { useAuth0 } from "../utils/react-auth0-wrapper";
import { useConnections } from "../utils/connections";
import callApi from "../utils/callApi";
import Loading from '../components/Loading';
import Button from 'react-bootstrap/Button';

const BaseProvider = ({ 
    pageTitle, 
    connectionName, 
    endpoint, 
    //control, 
    onLoadHandler,
    setData,
    children
  }) => {

  //const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { getTokenSilently } = useAuth0();

  const { connections } = useConnections();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }
  
  // load data from provider
  const loadData = async (forceRefresh = false) => { 
    setLoading(true);

    // invoke the on load handler function if supplied by provider
    onLoadHandler && onLoadHandler();

    const token = await getTokenSilently();
    const [response, error] = await callApi(token, endpoint, forceRefresh);

    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setData(null);
      setErrorMessage("Can't reach server - try refreshing later");
      return;
    }

    // items always come back as an array
    const items = await response.json();

    setLoadedData(true);
    setLoading(false);
    setErrorMessage(null);
    setData(items);
  }

  // if connections not loaded, set an error message
  if (!connections || !connections.find) {
    return(
      <div>
        <i className="fa fa-frown-o"/>
        <span>&nbsp;{errorMessage}</span>
      </div>
    )
  }

  // find whether we are connected to the provider
  const connection = connections.find(el => el.provider === connectionName);
  if (!connection || !connection.connected) {
    // need to connect first
    // TODO: button to move to settings page
    const [provider] = pageTitle.split(' ');
    return(
      <div>
        <br/>
        <Button onClick={ () => { navigate('/conns') }}>
          {`Connect to ${provider}`} 
        </Button>
      </div>
    )
  }

  // if haven't loaded data yet, do so now
  if (!loadedData) {
    loadData();
    return <Loading />;
  }

  return(
    <div>
      <br/>
      <div className="provider-header">
        <Button onClick={() => { loadData(true) }}>
          <i className="fa fa-refresh"></i>
        </Button>
        <h3 className="provider-title">{pageTitle}</h3>
      </div>
      <br/>
      { children }
    </div>
  )
}

export default BaseProvider