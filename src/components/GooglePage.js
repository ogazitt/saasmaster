import React, { useState } from 'react'
import { useAuth0 } from "../utils/react-auth0-wrapper";
import { useConnections } from "../utils/connections";
import Loading from './Loading';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';


const GooglePage = () => {
  // set the provider name
  const providerName = 'google-oauth2';

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const { getTokenSilently } = useAuth0();

  const { connections } = useConnections();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }
  
  // load data from provider
  const loadData = async () => { 
    setLoading(true);
    try {
      const token = await getTokenSilently();
      
      // construct API service URL
      const baseUrl = window.location.origin;
      const urlObject = new URL(baseUrl);

      // replace port for local development from 3000 to 8080
      if (urlObject.port && urlObject.port > 80) {
        urlObject.port = 8080;
      }

      const url = urlObject + 'google';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error(response);
        setLoadedData(true);
        setLoading(false);
        setData(null);
        return;
      }

      const responseData = await response.json();
      const items = responseData && responseData.items;

      setLoadedData(true);
      setLoading(false);
      setData(items);
    } catch (error) {
      console.error(error);
      setLoadedData(true);
      setLoading(false);
      setData(null);
      return;
    }
  };

  // find whether we are connected to the provider
  const connection = connections && connections.find(el => el.provider === providerName);
  if (!connection || !connection.connected) {
    // need to connect first
    // TODO: button to move to settings page
    return(
      <div>
        <br/>
        <h2>Please connect to Google</h2>
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
      <h1>Google</h1>
      <button onClick={loadData}>Refresh</button>
      <br/>
      <br/>
      { 
        loadedData && data ? 
          <CardDeck>
          {
            data.map((item, key) => {
              const { summary, backgroundColor } = item;
              return (
                <Card 
                  key={key} 
                  style={{ maxWidth: '150px', textAlign: 'center', color: backgroundColor }}>
                  <Card.Body>
                    <Card.Title className="text-center">{ summary }</Card.Title>
                  </Card.Body>
                </Card>    
              )
            })
          }
          </CardDeck>
        : <div />
      }
    </div>
  );
}

export default GooglePage