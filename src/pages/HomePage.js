import React from 'react'
import Loading from '../components/Loading'
import Highlight from '../components/Highlight'
import { useAuth0 } from '../utils/react-auth0-wrapper'

const HomePage = () => {
  const { loading, user, getIdTokenClaims } = useAuth0();

  if (loading) {
    return <Loading />;
  }
  
  return (
    <div>
      <br/>
      <div className="provider-header">
        <img src="SaaSMaster.png" alt="logo"/>
      </div>
      <br/>
      {user && <Highlight>{JSON.stringify(user, null, 2)}</Highlight>}
      {user && <Highlight>{JSON.stringify(getIdTokenClaims(), null, 2)}</Highlight>}
    </div>
  )
}

export default HomePage

