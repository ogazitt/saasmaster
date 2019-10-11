import React from 'react'
import Frame, { FrameContextConsumer } from 'react-frame-component'
import { useAuth0 } from "../utils/react-auth0-wrapper";
import ExternalApi from './ExternalApi';
import Loading from './Loading';

const AboutPage = () => {
  const { loading, isAuthenticated } = useAuth0();

  if (loading) {
    return <Loading />
  }
  if (!isAuthenticated) {
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