import React from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import Loading from '../components/Loading'
import WebsiteFooter from '../components/WebsiteFooter'
import { Button, Carousel, Row, Col } from 'react-bootstrap'
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

  return (
    <div className="Landing">
      <div className="bg-overlay">
        <Button style={{ position: 'fixed', right: 20, top: 20 }} size="lg" disabled={loading} onClick={() => login()}>Log In</Button>
        <div style={{ 
          position: 'fixed',
          left: 20,
          top: 20,
          display: 'flex'
        }}>
          <img src="/SaaSMaster-logo-220.png" className="Landing-logo" alt="logo"/>
          <h1 style={{ fontSize: '3em' }}>SaaS Master</h1>
        </div>
        <div className="tagline">
          <h1>Master your online reputation</h1>
          <br/>
          <Button size="lg" variant="info" disabled={loading} onClick={() => signUp()}>Get started</Button>          
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
            <h3>Connect all of the tools you use for your online business identity</h3>
            <i className="soc-icon fa fa-lg fa-facebook-square"></i>
            <i className="soc-icon fa fa-lg fa-google"></i>
            <i className="soc-icon fa fa-lg fa-twitter"></i>
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
            <h3>View all user feedback for your business from one console</h3>
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
            <h3>Effortlessly prioritize and reply to positive and negative feedback</h3>
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
            <h3>Track your reputation over time with beautiful charts</h3>
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
            <h3>Get notified of new reviews over email or SMS</h3>
            <i className="soc-icon fa fa-lg fa-envelope"></i>
            <i className="soc-icon fa fa-lg fa-phone"></i>
          </Carousel.Caption>
        </Carousel.Item>        
      </Carousel>
      
      <WebsiteFooter />
    </div>
  )
}

export default LandingPage