import React from 'react'
import { navigate } from 'hookrouter'

// import navbar component and styles
import Navbar from '@trendmicro/react-navbar'
import { Nav, NavItem } from '@trendmicro/react-navs'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import '@trendmicro/react-navs/dist/react-navs.css'
import '@trendmicro/react-navbar/dist/react-navbar.css'
import './WebsiteFooter.css'

const WebsiteFooter = () => {
  return (
    <div className="websiteFooter">
      <Navbar>
        <Navbar.Header>
          <Navbar.Toggle />
        </Navbar.Header>
        <Nav
          navStyle="navbar"
        >
          <NavItem onSelect={() => navigate('/terms')}>
            Terms
          </NavItem>
          <NavItem onSelect={() => navigate('/privacy')}>
            Privacy
          </NavItem>
          <NavItem>
            Copyright (c) 2019
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  )
}

export default WebsiteFooter