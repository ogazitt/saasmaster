import React from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { useMetadata } from '../utils/metadata'
import App from './App'
import LandingPage from './LandingPage'
import Loading from '../components/Loading'

const AppWrapper = () => {
  const { loading, isAuthenticated } = useAuth0()
  const { loaded: loadedConnections, loading: loadingConnections, loadConnections } = useConnections();
  const { loaded: loadedMetadata, loading: loadingMetadata, loadMetadata } = useMetadata();

  // if in the middle of an auth0 loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // if not authenticated, render landing page and bail
  if (!isAuthenticated) {
    return (
      <LandingPage />
    )  
  }

  // if loading connections or metadata, put up a loading banner and bail
  if (loadingConnections || loadingMetadata) {
    return <Loading />
  }

  // load connections data
  const loadConns = async () => { 
    await loadConnections();
  };

  // load metadata
  const loadMeta = async () => { 
    await loadMetadata();
  };

  // if haven't loaded connections yet, do so now
  if (!loadingConnections && !loadedConnections) {
    loadConns();
  }

  // if haven't loaded metadata yet, do so now
  if (!loadingMetadata && !loadedMetadata) {
    loadMeta();
  }
  
  // everything is loaded, so render the app
  return (
    <App />
  )
}

export default AppWrapper
