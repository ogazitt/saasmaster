import React, { useState } from 'react';
import { useAuth0 } from "../utils/react-auth0-wrapper";
import { useConnections } from "../utils/connections";
import callApi from "../utils/callApi";
import Loading from '../components/Loading';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';

const BaseProvider = ({ 
    pageTitle, 
    connectionName, 
    onLoadHandler,
    endpoint, 
    dataIndex, 
    card, 
    onClickHandler, 
    selected 
  }) => {

  const [data, setData] = useState();
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
  const loadData = async () => { 
    setLoading(true);

    // invoke the on load handler function if supplied by provider
    onLoadHandler && onLoadHandler();

    const token = await getTokenSilently();
    const [response, error] = await callApi(token, endpoint);

    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setData(null);
      setErrorMessage("Can't reach server - try refreshing later");
      return;
    }

    const responseData = await response.json();
    const items = responseData && (dataIndex ? responseData[dataIndex] : responseData);

    setLoadedData(true);
    setLoading(false);
    setErrorMessage(null);
    setData(items);
  };

  if (loadedData && data) {
    // find whether we are connected to the provider
    const connection = connections && connections.find(el => el.provider === connectionName);
    if (!connection || !connection.connected) {
      // need to connect first
      // TODO: button to move to settings page
      return(
        <div>
          <br/>
          <h2>{`Please connect to ${pageTitle}`}</h2>
        </div>
      )
    }
  }

  // if haven't loaded data yet, do so now
  if (!loadedData) {
    loadData();
    return <Loading />;
  }

  return(
    <div>
      <br/>
      <div class="provider-header">
        <Button onClick={loadData}><i class="fa fa-refresh"></i></Button>
        <h3 class="provider-title">{pageTitle}</h3>
      </div>
      <br/>
      { 
        loadedData && data ? 
          <CardDeck>
          {
            data.map((item, key) => card({ item, key, onClickHandler, selected }))
          }
          </CardDeck>
        : errorMessage ? 
          <div>
            <i className="fa fa-frown-o"/>
            <span>&nbsp;{errorMessage}</span>
          </div>
          :
          <div />
      }
    </div>
  );
}

export default BaseProvider;