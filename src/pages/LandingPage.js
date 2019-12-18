import React from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import Loading from '../components/Loading'
import Button from 'react-bootstrap/Button'
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
      <header className="Landing-header">
        <img src="SaaSMaster-logo-220.png" className="Landing-logo" alt="logo"/>
        <br/>
        <h1>SaaS Master</h1>
        <p>Master your online reputation</p>
      </header>

      <div className="container-fluid">
        <div className="Landing-features row">
          <div className="col col--4">
            Connect all of the tools you use for your online business identity
          </div>
          <div className="col col--4">
            View all user feedback for your business from one console
          </div>
          <div className="col col--4">
            Effortlessly prioritize and reply to positive and negative feedback
          </div>
        </div>

        <div className="Landing-features row">
          <div className="col col--4">
            <i className="soc-icon fa fa-lg fa-facebook-square"></i>
            <i className="soc-icon fa fa-lg fa-google"></i>
            <i className="soc-icon fa fa-lg fa-twitter"></i>
            <i className="soc-icon fa fa-lg fa-instagram"></i>
          </div>
          <div className="col col--4">
            <i className="soc-icon fa fa-lg fa-comment-o"></i>
            <i className="soc-icon fa fa-lg fa-heart-o"></i>
            <i className="soc-icon fa fa-lg fa-hashtag"></i>
            <i className="soc-icon fa fa-lg fa-map-marker"></i>
          </div>
          <div className="col col--4">
            <i className="soc-icon fa fa-lg fa-thumbs-o-up"></i>
            <i className="soc-icon fa fa-lg fa-thumbs-o-down"></i>
          </div>
        </div>

        <div className="Landing-action row">
          <div className="col col--6">
            <Button size="lg" variant="info" disabled={loading} onClick={() => signUp()}>Sign Up</Button>          
          </div>
          <div className="col col--6">
            <Button size="lg" disabled={loading} onClick={() => login()}>Log In</Button>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 'calc(100vw - 60px)', top: 'calc(100vh - 25px'}}>
        <a href="privacy">Privacy</a>
      </div>
    </div>
  )
}

export default LandingPage