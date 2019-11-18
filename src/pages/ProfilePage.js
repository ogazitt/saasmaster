import React, { useState } from 'react'
import Loading from '../components/Loading'
import Highlight from '../components/Highlight'
import { useAuth0 } from "../utils/react-auth0-wrapper";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { getTokenSilently } = useAuth0();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // force load of profile data
  const load = async () => { 
    setLoading(true);
    try {
      const token = await getTokenSilently();
      
      // construct API service URL
      const baseUrl = window.location.origin;
      const urlObject = new URL(baseUrl);

      // replace port for local development from 3000 to 8080
      if (urlObject.port && urlObject.port > 80) {
        urlObject.port = 8080;
      }

      const url = urlObject + 'profile';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error(response);
        setLoaded(true);
        setLoading(false);
        setProfile(response);
        return;
        //return(<div/>);
      }

      const responseData = await response.json();

      setLoaded(true);
      setLoading(false);
      setProfile(responseData);
    } catch (error) {
      console.error(error);
      setLoaded(true);
      setLoading(false);
      setProfile(error);
      return;
      //return(<div/>);
    }
  };

  // if haven't loaded profile yet, do so now
  if (!loaded) {
    load();
    return <Loading />;
  }

  return(
    <div style={{
      marginLeft: 20,
      padding: '1px 0 0 20px',
      textAlign: 'left'
    }}>
      <h1>Profile</h1>
      <button onClick={load}>Refresh</button>
      <br/>
      <br/>
      { 
        loaded ? <Highlight>{JSON.stringify(profile, null, 2)}</Highlight> : <div/>
      }
    </div>
  );
};

export default ProfilePage