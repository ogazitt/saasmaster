import React from 'react'
import { useConnections } from "../utils/connections";
import ExternalApi from './ExternalApi';
import Loading from './Loading';

const ConnectPage = () => {
  const { loading, loadConnections, connections } = useConnections();

  if (loading) {
    return <Loading />
  }

  await loadConnections();

  return(
    <div>
      <h1>Connect</h1>
      { 
        <ExternalApi />
      }
    </div>
  )
}

export default ConnectPage