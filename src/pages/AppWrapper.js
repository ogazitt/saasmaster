import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { useMetadata } from '../utils/metadata'
import App from './App'
import Website from './Website'
import Loading from '../components/Loading'

const AppWrapper = () => {
  const { loading, isAuthenticated } = useAuth0()
  const { loaded: loadedConnections, loadConnections } = useConnections();
  const [loadingConnections, setLoadingConnections] = useState(false);
  const { loaded: loadedMetadata, loadMetadata } = useMetadata();
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  
  //const { loaded: loadedConnections, loading: loadingConnections, loadConnections } = useConnections();
  //const { loaded: loadedMetadata, loading: loadingMetadata, loadMetadata } = useMetadata();

  // if in the middle of an auth0 loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // if not authenticated, render landing page and bail
  if (!isAuthenticated) {
    return (
      <Website />
    )  
  }

  // if loading connections or metadata, put up a loading banner and bail
  if (loadingConnections || loadingMetadata) {
    return <Loading />
  }

  // load connections data
  const loadConns = async () => { 
    await loadConnections();
    setLoadingConnections(false);
  };

  // load metadata
  const loadMeta = async () => { 
    await loadMetadata();
    setLoadingMetadata(false);
  };

  // if haven't loaded connections yet, do so now
  if (!loadingConnections && !loadedConnections) {
    setLoadingConnections(true);
    loadConns();
  }

  // if haven't loaded metadata yet, do so now
  if (!loadingMetadata && !loadedMetadata) {
    setLoadingMetadata(true);
    loadMeta();
  }
  
  // everything is loaded, so render the app
  return (
    <App />
  )
}

export default AppWrapper
