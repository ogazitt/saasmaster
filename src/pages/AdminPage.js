import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { useAuth0 } from '../utils/react-auth0-wrapper'

const AdminPage = () => {

  const { isAdmin, impersonatedUser, setImpersonatedUser } = useAuth0();
  const [user, setUser] = useState(impersonatedUser);

  if (!isAdmin) {
    return (
      <div className="provider-header">
        <h4 className="provider-title">ERROR: You are not an admin!</h4>
      </div>
    )
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
          <FormControl
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1" 
            value={user} onChange={(e) => setUser(e.target.value)}
          />
        </InputGroup>

        <div style={{ display: 'flex' }}>
          <Button style={{ marginRight: 20}} onClick={() => setImpersonatedUser(user)}>Impersonate</Button>
          <Button style={{ marginRight: 20}} onClick={() => { setUser(""); setImpersonatedUser(null)}}>Clear</Button>
        </div>
      </div>

    </div>
  )
}

export default AdminPage

