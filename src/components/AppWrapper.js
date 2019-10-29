import React from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import App from './App'
import LandingPage from './LandingPage'
import Loading from './Loading'

const AppWrapper = () => {
  const { loading, isAuthenticated } = useAuth0()
  if (loading) {
    return (
      //<LandingPage />
      <Loading />
    );
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
