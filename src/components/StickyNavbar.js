/*
import Anchor from '@trendmicro/react-anchor';
import Dropdown from '@trendmicro/react-dropdown';
*/
import Navbar from '@trendmicro/react-navbar';
import { Nav, NavDropdown, NavItem, MenuItem } from '@trendmicro/react-navs';
import PropTypes from 'prop-types';
import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
//import styles from './index.styl';
import { useAuth0 } from "../utils/react-auth0-wrapper";

import Loading from './Loading'

/*
const PageContent = () => (
    <div
        style={{
            border: '1px solid #ddd',
            backgroundColor: '#f5f5f5',
            height: 600,
            marginTop: 15
        }}
    >
        <div className="container-fluid">
            <h3>Page Content</h3>
        </div>
    </div>
);
*/

const StickyNavbar = ({ state, actions }) => {
  const { loading, user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  if (loading) {
    console.log("loading");
    return (
      <Loading />
    );
  }

  const login = () => {
    loginWithRedirect({
      access_type: 'offline', 
      connection_scope: 'https://www.googleapis.com/auth/calendar.events.readonly', 
      approval_prompt: 'force'
    });
  }

  return (
    <StickyContainer>
      <Sticky>
        <Navbar>
          <Navbar.Header>
            <Navbar.Toggle />
          </Navbar.Header>
          <Nav
            navStyle="navbar"
            activeKey={state.tab}
          >
            <NavItem className="text-center" style={{ minWidth: 65 }}>
              <i className="fa fa-star" style={{ color: '#fff' }} />
            </NavItem>
            <NavItem eventKey="business" onSelect={actions.selectTab}>
              My Business
            </NavItem>
            <NavItem eventKey="employees" onSelect={actions.selectTab}>
              My Employees
            </NavItem>
            {isAuthenticated ?
              <NavDropdown
                autoOpen
                pullRight
                eventKey="administration"
                title={ user.name }
                style={{ position: 'fixed', right: 0 }}
              >
                <MenuItem eventKey="profile">Profile</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="logout" onSelect={() => { logout() }}>Logout</MenuItem>
              </NavDropdown> :
              <NavItem eventKey="login" onSelect={() => { login() }} style={{ position: 'fixed', right: 0 }}>
                Login
              </NavItem>
            }
          </Nav>
        </Navbar>
        {/*
        <Button
            className={classNames(styles.navbarBtn, styles.navbarRight)}
            btnStyle="flat"
            onClick={() => {
                window.location = url;
            }}
        >
          <i className="fa fa-github" />
          GitHub
        </Button>*/}
      </Sticky>
      {/* }
      <PageContent />
      */}
    </StickyContainer>
  );
};

StickyNavbar.propTypes = {
  state: PropTypes.object,
  actions: PropTypes.object
};

export default StickyNavbar;