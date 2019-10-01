import React from 'react'
import Frame, { FrameContextConsumer } from 'react-frame-component'

const AboutPage = () => {
  return(
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
    )
}

export default AboutPage