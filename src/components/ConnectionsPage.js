import React, { useState } from 'react';
import { useConnections } from '../utils/connections';
import Loading from './Loading';
import Highlight from './Highlight';
import Connections from './Connections';

const ConnectionsPage = () => {
  const { loading, isLoaded, loadConnections, connections } = useConnections();
  const [showResult, setShowResult] = useState(false);
  const [loadingConnections, setLoadingConnections] = useState(false);

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // force load of connections data
  const load = async () => { 
    setShowResult(false);
    setLoadingConnections(true);
    await loadConnections();
    setShowResult(true);
    setLoadingConnections(false);
  };

  // if haven't loaded connections yet, do so now
  if (!isLoaded && !loadingConnections) {
    load();
  }

  // if results have loaded already, then show those results
  if (isLoaded && !showResult) {
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
//        showResult ? <Highlight>{JSON.stringify(connections, null, 2)}</Highlight> : <div/>
        showResult ? <Connections/> : <div/>
}
    </div>
  );
};

export default ConnectionsPage;