import React from 'react'
//import { MDBInput } from 'mdbreact'
//import 'mdbreact/dist/css/mdb.css'
import { Form, Card } from 'react-bootstrap'

const CheckboxGroup = ({
  state,
  onSelect
}) => {
  return (
    <div>
    { /* <MDBInput label="Filled unchecked" filled type="checkbox" id="checkbox1" /> */ }

    <Card style={{ width: '10rem' }}>
      <Card.Body>
      { 
        state && Object.keys(state).map(item =>
          <Card.Subtitle className="text-muted">
            <Form.Group>
              <Form.Check label={<span>&nbsp;{state[item].title}</span>}
                type="checkbox"
                key={item}
                name={state[item].name}
                checked={state[item].state}
                onChange={onSelect}
                style={{ fontSize: '1.2em' }}
              />
            </Form.Group>
          </Card.Subtitle>)
      }
      </Card.Body>
    </Card>
    </div>
  )
}

export default CheckboxGroup