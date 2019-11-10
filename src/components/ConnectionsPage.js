import React, { useState } from 'react';
import { useConnections } from '../utils/connections';
import Loading from './Loading';
import Connections from './Connections';

const ConnectionsPage = () => {
  const { loading, loaded, loadConnections } = useConnections();
  const [showResult, setShowResult] = useState(false);
  const [didLoad, setDidLoad] = useState(false);

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
    </div>
  );
};

export default ConnectionsPage;