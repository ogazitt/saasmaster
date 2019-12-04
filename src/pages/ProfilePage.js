import React, { useState } from 'react'
import Loading from '../components/Loading'
import Highlight from '../components/Highlight'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import callApi from '../utils/callApi'
import Button from 'react-bootstrap/Button'

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const { getTokenSilently } = useAuth0();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading) {
    return <Loading />
  }

  // force load of profile data
  const loadData = async () => { 
    setLoading(true);

    const token = await getTokenSilently();
    const [response, error] = await callApi(token, 'profile');

    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setProfile(response);
      return;
    }

    const responseData = await response.json();
    setLoadedData(true);
    setLoading(false);
    setProfile(responseData);
  };

  // if haven't loaded profile yet, do so now
  if (!loadedData) {
    loadData();
    return <Loading />
  }

  return(
    <div style={{
      marginLeft: 20,
      padding: '1px 0 0 20px',
      textAlign: 'left',
      width: 'calc(100vw - 60px)'
    }}>
      <div className="provider-header">
        <Button onClick={loadData}><i className="fa fa-refresh"></i></Button>
        <h3 className="provider-title">Profile</h3>
      </div>
      { 
        loadedData ? <Highlight>{JSON.stringify(profile, null, 2)}</Highlight> : <div/>
      }
    </div>
  );
};

export default ProfilePage