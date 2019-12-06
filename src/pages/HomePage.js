import React from 'react'
import Loading from '../components/Loading'
import Highlight from '../components/Highlight'
import { useAuth0 } from '../utils/react-auth0-wrapper'

const HomePage = () => {
  const { loading, user } = useAuth0();

  if (loading) {
    return <Loading />;
  }
  
  return (
    <div>
      <div className="provider-header">
        <h3>Home</h3>
      </div>
      {user && <Highlight>{JSON.stringify(user, null, 2)}</Highlight>}
    </div>
  )
}

export default HomePage

