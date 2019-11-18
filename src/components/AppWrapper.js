import React, { useState } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from "../utils/connections";
import App from './App'
import LandingPage from './LandingPage'
import Loading from './Loading'

const AppWrapper = () => {
  const { loading, isAuthenticated } = useAuth0()
  const { loaded: loadedConnections, loadConnections } = useConnections();
  const [loadingConnections, setLoadingConnections] = useState(false);

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // load connections data
  const loadConns = async () => { 
    await loadConnections();
  };

  // if haven't loaded connections yet, do so now
  if (!loadingConnections && !loadedConnections) {
    setLoadingConnections(true);
    loadConns();
  }

  if (isAuthenticated) {
    return (
      <App />
    )
  }

  return (
    <LandingPage />
  )
}

export default AppWrapper
