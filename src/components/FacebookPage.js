import React from 'react'
import { useAuth0 } from "../utils/react-auth0-wrapper";
import ExternalApi from './ExternalApi';
import Loading from './Loading';

const FacebookPage = () => {
  const { loading, isAuthenticated } = useAuth0();

  if (loading) {
    return <Loading />
  }

  return(
    <div>
      <h1>Facebook</h1>
      { 
        isAuthenticated ? 
        <ExternalApi /> :
        <div />
      }
    </div>
  )
}

export default FacebookPage