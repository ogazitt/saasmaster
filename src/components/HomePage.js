import React from 'react'
import Loading from './Loading'
import Highlight from './Highlight'
import { useAuth0 } from '../utils/react-auth0-wrapper'

const HomePage = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Loading />;
  }
  
  return (
    <div>
      <h1>Home</h1>
      <img src="saasmaster.png" alt="logo"/>
      <br/>
      <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
    </div>
  )
}

export default HomePage

