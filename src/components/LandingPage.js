import React from 'react'
import './LandingPage.css'
import 'font-awesome/css/font-awesome.min.css';

import Loading from './Loading';
import { useAuth0 } from "../utils/react-auth0-wrapper";

import Button from 'react-bootstrap/Button';

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
      connection_scope: 'https://www.googleapis.com/auth/calendar.events.readonly', // unverified BUT THIS MAY BE IT
      redirect_uri: `${window.location.origin}`,
      saasmaster_mode: 'signUp',
    });
  }

  return (
    <div className="Landing">
      <header className="Landing-header">
        <img src="SaaSMaster.png" className="Landing-logo" alt="logo"/>
        <br/>
        <h1>SaaS Master</h1>
        <p>Master all your SaaS tools from one console</p>
      </header>

      <div className="Landing-features row">
        <div className="col col--4">
          Connect all of the tools you use to manage your online business identity
        </div>
        <div className="col col--4">
          Manage all of your business settings from one place
        </div>
        <div className="col col--4">
          Provision and manage your employee payroll and HR from a single place
        </div>
      </div>

      <div className="Landing-features row">
        <div className="col col--4">
          <i className="soc-icon fa fa-facebook-square"></i>
          <i className="soc-icon fa fa-google"></i>
          <i className="soc-icon fa fa-twitter"></i>
          <i className="soc-icon fa fa-linkedin"></i>
        </div>
        <div className="col col--4">
          <img width="80px" src="gmaps.png" alt="google maps"/>
        </div>
        <div className="col col--4">
          <img width="30px" src="quickbooks.png" alt="quickbooks"/>
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
  )
}

export default LandingPage