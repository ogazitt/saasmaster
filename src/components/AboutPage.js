import React from 'react'
import Frame, { FrameContextConsumer } from 'react-frame-component'
import { useAuth0 } from "../utils/react-auth0-wrapper";
import ExternalApi from './ExternalApi';

const AboutPage = () => {
  const { loading, user, isAuthenticated } = useAuth0();

  console.log(`loading: ${loading}; isAuthenticated: ${isAuthenticated}`)
  if (loading || !isAuthenticated) {
    return <div />
  }

  return(
    <ExternalApi />
    /*
    <Frame>
      <FrameContextConsumer>
      {
        // Callback is invoked with iframe's window and document instances
        ({document, window}) => {
            document = 'www.google.com'
        // Render Children
        }
      }
      </FrameContextConsumer>
    </Frame>
    */
    )
}

export default AboutPage