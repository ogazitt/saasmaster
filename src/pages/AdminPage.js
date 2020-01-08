import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Highlight from '../components/Highlight'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { useApi } from '../utils/api'


const AdminPage = () => {
  const { isAdmin, impersonatedUser, setImpersonatedUser } = useAuth0();
  const { get } = useApi();
  const { loadConnections } = useConnections();
  const [userId, setUserId] = useState(impersonatedUser || "");
  const [profile, setProfile] = useState({});

  // use an effect to re-load connections if the impersonated user has been updated  
  useEffect(() => {
    loadConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [impersonatedUser]);

  // use an effect to load the profile information for the currently impersonated user
  useEffect(() => {
    async function loadProfile() {
      const [response, error] = await get('profile');
      if (error || !response.ok) {
        setProfile({ message: 'error retrieving profile'});
        return;
      }

      const responseData = await response.json();
      setProfile(responseData);
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [impersonatedUser]);

  // display an error if current user isn't an admin
  if (!isAdmin) {
    return (
      <div className="provider-header">
        <h4 className="provider-title">ERROR: You are not an admin!</h4>
      </div>
    )
  }

  const impersonate = async (user) => {
    // set the impersonated user, and after that completes, reload connections and metadtaa
    setImpersonatedUser(user);
  }

  return (
    <div style={{ marginLeft: 20 }}>
      <div className="provider-header">
        <h4 className="provider-title">Admin</h4>
      </div>

      <div style={{ margin: 20, marginTop: 0, width: 450 }}>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Impersonate: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl placeholder="username" value={userId} onChange={(e) => setUserId(e.target.value)}/>
        </InputGroup>

        <div style={{ display: 'flex' }}>
          <Button style={{ marginRight: 20}} onClick={() => impersonate(userId)}>Impersonate</Button>
          <Button style={{ marginRight: 20}} onClick={() => { setUserId(""); impersonate(null)}}>Clear</Button>
        </div>
      </div>
      <div style={{
        padding: '1px 0 0 20px',
        textAlign: 'left',
        width: 'calc(100vw - 60px)'
      }}>
      { 
        profile && 
        <div>
          <h5>Profile data</h5>
          <Highlight>{JSON.stringify(profile, null, 2)}</Highlight> 
        </div>
      }
      </div>
    </div>
  )
}

export default AdminPage

