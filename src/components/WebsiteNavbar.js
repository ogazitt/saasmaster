import React from 'react'
import { navigate } from 'hookrouter'

// import navbar component and styles
import Navbar from '@trendmicro/react-navbar'
import { Nav, NavItem } from '@trendmicro/react-navs'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import '@trendmicro/react-navs/dist/react-navs.css'
import '@trendmicro/react-navbar/dist/react-navbar.css'
import './StickyNavbar.css'

const WebsiteNavbar = () => {
  return (
    <div className="stickyNavBarContainer">
      <Navbar className="stickyNavBar">
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Nav
          navStyle="navbar"
        >
          <NavItem 
            className="stickyNavBarLogo text-center" 
            style={{ width: 65 }} 
            onSelect={ () => navigate('/')}>
            <img src="/SaaSMaster-logo-220.png" height="40px" alt="logo"/>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  )
}

export default WebsiteNavbar