import React from 'react';
import PropTypes from 'prop-types';

// import navbar component and styles
import Navbar from '@trendmicro/react-navbar';
import { Nav, NavDropdown, NavItem, MenuItem } from '@trendmicro/react-navs';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import '@trendmicro/react-navs/dist/react-navs.css';
import '@trendmicro/react-navbar/dist/react-navbar.css';
import './StickyNavbar.css';

import { useAuth0 } from "../utils/react-auth0-wrapper";
import Loading from './Loading';

const StickyNavbar = ({ state, actions }) => {
  const { loading, user, logout } = useAuth0();
  if (loading) {
    return (
      <Loading />
    );
  }

  const logoutWithRedirect = () => {
    logout({
      returnTo: window.location.origin
    });
  }

  return (
    <div className="stickyNavBarContainer">
      <Navbar className="stickyNavBar">
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Nav
          navStyle="navbar"
          activeKey={state.tab}
        >
          <NavItem className="stickyNavBarLogo text-center" style={{ width: 65 }}>
            {/*<i className="fa fa-star" style={{ color: '#fff' }} />*/}
            <img src="SaaSMaster-logo-220.png" height="40px" alt="logo"/>
          </NavItem>
          <NavItem className="navBarItem" eventKey="business" onSelect={actions.selectTab}>
            My Business
          </NavItem>
          <NavItem className="navBarItem" eventKey="employees" onSelect={actions.selectTab}>
            My Employees
          </NavItem>
          <NavDropdown className="navBarItem" 
            autoOpen
            pullRight
            eventKey="administration"
            title={ user.name }
            style={{ position: 'fixed', right: 0, zIndex: 50 }}
          >
            <MenuItem eventKey="profile" onSelect={actions.selectTab}>Profile</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="logout" onSelect={() => { logoutWithRedirect() }}>Logout</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
    </div>
  );
};

StickyNavbar.propTypes = {
  state: PropTypes.object,
  actions: PropTypes.object
};

export default StickyNavbar;