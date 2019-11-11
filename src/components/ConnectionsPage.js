import React, { useState } from 'react';
import { useConnections } from '../utils/connections';
import Loading from './Loading';
import Connections from './Connections';

// testing link API
import { useAuth0 } from "../utils/react-auth0-wrapper";

const ConnectionsPage = () => {
  const { loading, loaded, loadConnections } = useConnections();
  const [showResult, setShowResult] = useState(false);
  const [didLoad, setDidLoad] = useState(false);

  // testing link API
  const { getTokenSilently } = useAuth0();
  const [userId, setUserId] = useState();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // force load of connections data
  const load = async () => { 
    await loadConnections();
  };

  // if haven't loaded connections yet, do so now
  if (!loading && !didLoad) {
    load();
    setDidLoad(true);
  }

  // if results have loaded already, then show those results
  if (loaded && !showResult) {
    setShowResult(true);
  }

  // testing link API
  const call = async (action) => { 
    try {
      const token = await getTokenSilently();
      
      // construct API service URL
      const baseUrl = window.location.origin;
      const urlObject = new URL(baseUrl);

      // replace port for local development from 3000 to 8080
      if (urlObject.port && urlObject.port > 80) {
        urlObject.port = 8080;
      }

      const url = urlObject + 'link';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            action: action,
            secondaryUserId: userId 
          })
      });
      
      if (!response.ok) {
        console.error(response);
        return;
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
      return;
    }
  };  

  const link = () => { call('link') }
  const unlink = () => { call('unlink') }

  // initiate forcing load of connections data
  //load();

  return(
    <div>
      <h1>Connections</h1>
      <button onClick={load}>Refresh</button>
      <br/>
      <br/>
      { 
        showResult ? <Connections/> : <div/>
      }
      <br />
      <br />
      <input value={userId} onInput={e => setUserId(e.target.value)}/>
      <button onClick={link}>Link</button>
      <button onClick={unlink}>Unlink</button>
    </div>
  );
};

export default ConnectionsPage;