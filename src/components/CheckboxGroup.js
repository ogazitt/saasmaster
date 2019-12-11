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

    <Card style={{ width: '6rem' }}>
      <Card.Body>
      { 
        state && Object.keys(state).map(item => {
          const label = <i className={`fa fa-fw fa-${state[item].title} text-muted`} style={{ fontSize: '1.2em' }} />
          return (
            <Card.Subtitle>
              <Form.Group>
                <Form.Check label={<span>&nbsp;{label}</span>}
                  type="checkbox"
                  key={item}
                  name={state[item].name}
                  checked={state[item].state}
                  onChange={onSelect}
                  style={{ fontSize: '1.2em' }}
                />
              </Form.Group>
            </Card.Subtitle>
          )})
      }
      </Card.Body>
    </Card>
    </div>
  )
}

export default CheckboxGroup