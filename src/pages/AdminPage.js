import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { useMetadata } from '../utils/metadata'

const AdminPage = () => {

  const { isAdmin, impersonatedUser, setImpersonatedUser } = useAuth0();
  const { loadConnections } = useConnections();
  const { loadMetadata } = useMetadata();
  const [user, setUser] = useState(impersonatedUser || "");

  // use an effect to re-load connections and metadata if the impersonated user has been updated  
  useEffect(() => {
    loadConnections();
    loadMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [impersonatedUser]);

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
    <div>
      <div className="provider-header">
        <h4 className="provider-title">Admin</h4>
      </div>

      <div style={{ margin: 20, width: 450 }}>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Impersonate: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl placeholder="username" value={user} onChange={(e) => setUser(e.target.value)}/>
        </InputGroup>

        <div style={{ display: 'flex' }}>
          <Button style={{ marginRight: 20}} onClick={() => impersonate(user)}>Impersonate</Button>
          <Button style={{ marginRight: 20}} onClick={() => { setUser(""); impersonate(null)}}>Clear</Button>
        </div>
      </div>

    </div>
  )
}

export default AdminPage

