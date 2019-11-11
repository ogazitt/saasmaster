import React, { useState } from 'react'
import { useAuth0 } from "../utils/react-auth0-wrapper";
import Loading from './Loading';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';


const GooglePage = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { getTokenSilently } = useAuth0();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // force load of profile data
  const load = async () => { 
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
        setLoaded(true);
        setLoading(false);
        setData(null);
        return;
      }

      const responseData = await response.json();
      const items = responseData && responseData.items;

      setLoaded(true);
      setLoading(false);
      setData(items);
    } catch (error) {
      console.error(error);
      setLoaded(true);
      setLoading(false);
      setData(null);
      return;
    }
  };

  // if haven't loaded profile yet, do so now
  if (!loaded) {
    load();
    return <Loading />;
  }

  return(
    <div>
      <h1>Google</h1>
      <button onClick={load}>Refresh</button>
      <br/>
      <br/>
      { 
        loaded && data ? 
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