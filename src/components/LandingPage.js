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
      //connection_scope: 'https://www.googleapis.com/auth/business.manage', // unverified BUT THIS MAY BE IT
      //connection: 'google-oauth2',
      connection_scope: 'https://www.googleapis.com/auth/calendar.events.readonly', // unverified BUT THIS MAY BE IT
      //connection_scope: 'https://www.googleapis.com/auth/contacts.readonly',
      //scope: 'https://www.googleapis.com/auth/calendar.events.readonly', // verified - asks for scope, results in isAuth = false, but session cookie persists and next invocation is authenticated (?!)
      //prompt: 'consent',  // this re-prompts consent and returns refresh token
      // commenting out scope removes the BUG where I need to log in twice to show authenticated!!
      //scope: 'https://www.googleapis.com/auth/calendar.events.readonly', // verified - asks for scope, results in isAuth = false, but session cookie persists and next invocation is authenticated (?!)
      //scope: 'https://www.googleapis.com/auth/business.manage', // verified - asks for scope, results in isAuth = false, but session cookie persists and next invocation is authenticated (?!)
      //approval_prompt: 'force' // google rejected.  OLD verified - always prompts for OAuth delegated authz
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

      <div class="Landing-features row">
        <div class="col col--4">
          Connect all of the tools you use to manage your online business identity
        </div>
        <div class="col col--4">
          Manage all of your business settings from one place
        </div>
        <div class="col col--4">
          Provision and manage your employee payroll and HR from a single place
        </div>
      </div>

      <div class="Landing-features row">
        <div class="col col--4">
          <i class="soc-icon fa fa-facebook-square"></i>
          <i class="soc-icon fa fa-google"></i>
          <i class="soc-icon fa fa-twitter"></i>
          <i class="soc-icon fa fa-linkedin"></i>
        </div>
        <div class="col col--4">
          <img width="80px" src="gmaps.png" alt="google maps"/>
        </div>
        <div class="col col--4">
          <img width="30px" src="quickbooks.png" alt="quickbooks"/>
        </div>
      </div>

      <div class="Landing-action row">
        <div class="col col--6">
          <Button size="lg" variant="info">Sign Up</Button>          
        </div>
        <div class="col col--6">
          <Button size="lg" onClick={() => login()}>Log In</Button>
        </div>
      </div>

    </div>
  )
}

export default LandingPage