import React from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import Loading from '../components/Loading'
import WebsiteFooter from '../components/WebsiteFooter'
import { Button, Carousel } from 'react-bootstrap'
import { isBrowser, isMobile } from 'react-device-detect'
import './LandingPage.css'

const LandingPage = () => {
  const { loading, loginWithRedirect } = useAuth0();

  if (loading) {
    return (
      <Loading />
    );
  }

  const login = () => {
    loginWithRedirect({
      access_type: 'offline', // unverified - asks for offline access
      //connection: 'google-oauth2',
      //connection_scope: 'https://www.googleapis.com/auth/contacts.readonly',
      // this is how to combine more than one permission
      //connection_scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly', 
      //connection_scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/business.manage',
      //connection_scope: 'https://www.googleapis.com/auth/calendar',
      // this is the Google business scope, but can't actually use it!
      //connection_scope: 'https://www.googleapis.com/auth/business.manage', 
      //prompt: 'consent',  // this re-prompts consent and returns refresh token
      redirect_uri: `${window.location.origin}`,
    });
  }

  const signUp = () => {
    loginWithRedirect({
      access_type: 'offline', // unverified - asks for offline access
      //connection_scope: 'https://www.googleapis.com/auth/calendar.events.readonly', // unverified BUT THIS MAY BE IT
      redirect_uri: `${window.location.origin}`,
      saasmaster_mode: 'signUp',
    });
  }
  
  let isMobileDevice = isMobile;
  let isDesktopDevice = isBrowser;
  //isMobileDevice = true; 
  //isDesktopDevice = false;

  return (
    <div className="Landing">
      <div className="bg-overlay">
        { isDesktopDevice && 
          <Button style={{ position: 'fixed', right: 20, top: 20 }} size="lg" disabled={loading} onClick={() => login()}>Log In</Button>
        }
        <div style={{ 
          position: 'fixed',
          left: 20,
          top: 20,
          display: 'flex'
        }}>
          <img src="/SaaSMaster-logo-220.png" className="Landing-logo" alt="logo"/>
          <h1 style={ isDesktopDevice ? { fontSize: '3em' } : { fontsize: '2em' } }>SaaS Master</h1>
        </div>
        <div className="tagline">
          <h1>Master your online reputation</h1>
          { isDesktopDevice && <br/> }
          { isDesktopDevice && 
            <Button size="lg" variant="info" disabled={loading} onClick={() => signUp()}>Get started</Button>          
          }
          { isMobileDevice &&
            <div style={{ display: 'flex', alignItestims: 'center', justifyContent: 'center' }}>
              <Button style={{ margin: 20 }} size="lg" disabled={loading} onClick={() => login()}>Log In</Button>
              <Button style={{ margin: 20 }} size="lg" variant="info" disabled={loading} onClick={() => signUp()}>Get started</Button>          
            </div>
          }
        </div>
      </div>

      <Carousel>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/connections.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          }}>
          <Carousel.Caption>
            <h3><strong>Connect all of the tools you use for your online business identity</strong></h3>
            <i className="soc-icon fa fa-lg fa-facebook-square"></i>
            <i className="soc-icon fa fa-lg fa-twitter"></i>
            <i className="soc-icon fa fa-lg fa-google"></i>
            <i className="soc-icon fa fa-lg fa-yelp"></i>
            <i className="soc-icon fa fa-lg fa-instagram"></i>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/dashboard.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          }}>
          <Carousel.Caption>
            <h3><strong>View all user feedback for your business from one console</strong></h3>
            <i className="soc-icon fa fa-lg fa-comment-o"></i>
            <i className="soc-icon fa fa-lg fa-heart-o"></i>
            <i className="soc-icon fa fa-lg fa-hashtag"></i>
            <i className="soc-icon fa fa-lg fa-map-marker"></i>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/alerts.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          }}>
          <Carousel.Caption>
            <h3><strong>Effortlessly prioritize and reply to positive and negative feedback</strong></h3>
            <i className="soc-icon fa fa-lg fa-thumbs-o-up"></i>
            <i className="soc-icon fa fa-lg fa-thumbs-o-down"></i>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/history.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          }}>
          <Carousel.Caption>
            <h3><strong>Track your reputation over time with beautiful charts</strong></h3>
            <i className="soc-icon fa fa-lg fa-tachometer"></i>
            <i className="soc-icon fa fa-lg fa-pie-chart"></i>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item 
          className="bg-carousel" 
          style={{ 
            background: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/email.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
          }}>
          <Carousel.Caption>
            <h3><strong>Get email or SMS notifications when new reviews roll in</strong></h3>
            <i className="soc-icon fa fa-lg fa-envelope"></i>
            <i className="soc-icon fa fa-lg fa-phone"></i>
          </Carousel.Caption>
        </Carousel.Item>        
      </Carousel>

      { isDesktopDevice && <WebsiteFooter /> }
    </div>
  )
}

export default LandingPage