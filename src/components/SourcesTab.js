import React, { useState } from 'react'
import { useRoutes, navigate, useRedirect } from 'hookrouter'

// side nav control and styles
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'

// import pages
import ConnectionsPage from '../pages/ConnectionsPage'
import NotFoundPage from '../pages/NotFoundPage'

// import data provider pages
import TwitterPage from '../providers/Twitter'
import FacebookPage from '../providers/Facebook'
import InstagramPage from '../providers/Instagram'
import GooglePage from '../providers/Google'

const SourcesTab = () => {
  // create state variables for current path (which determines selected tab) and expanded state
  const currentPath = window.location.pathname;
  const [expanded, setExpanded] = useState(false);

  // constants that describe the top offset (to honor NavBar) and SidNav width
  const expandedWidth = 200;
  const collapsedWidth = 64;
  const topOffset = 50;

  const selectTab = (selected) => {
    navigate(`${selected}`)
  }

  // define routes
  const routes = {
    '/': () => <ConnectionsPage />,
    '/connections': () => <ConnectionsPage />,
    '/twitter': () => <TwitterPage />,
    '/facebook': () => <FacebookPage />,
    '/instagram': () => <InstagramPage />,
    '/google': () => <GooglePage />,
  };

  useRedirect('/', '/sources/connections');
  const routeResult = useRoutes(routes);

  return (
    <div>  
      <div style={{
        width: expanded ? expandedWidth : collapsedWidth,
        position: 'fixed', 
        left: 0,
        top: topOffset,
        height: `calc(100vh - ${topOffset}px)`
        }}>
        <SideNav style={{ minWidth: expanded ? expandedWidth : collapsedWidth }}
          onSelect={ selectTab }
          onToggle={ (expanded) => {            
            setExpanded(expanded)
          }}>
          <SideNav.Toggle />
          <SideNav.Nav selected={currentPath}>
            <NavItem eventKey="/sources/connections">
              <NavIcon>
                <i className="fa fa-fw fa-cog" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText style={{ fontSize: '1.2em' }}>Sources</NavText>
            </NavItem>
            <NavItem eventKey="/sources/twitter">
              <NavIcon>
                <i className="fa fa-fw fa-twitter" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText style={{ fontSize: '1.2em' }}>Twitter</NavText>
            </NavItem>
            <NavItem eventKey="/sources/facebook">
              <NavIcon>
                <i className="fa fa-fw fa-facebook" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText style={{ fontSize: '1.2em' }}>Facebook</NavText>
            </NavItem>
            <NavItem eventKey="/sources/instagram">
              <NavIcon>
                <i className="fa fa-fw fa-instagram" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText style={{ fontSize: '1.2em' }}>Instagram</NavText>
            </NavItem>
            <NavItem eventKey="/sources/google">
              <NavIcon>
                <i className="fa fa-fw fa-google" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText style={{ fontSize: '1.2em' }}>Google</NavText>
            </NavItem>
          </SideNav.Nav>
        </SideNav>
      </div>
      <div style={{
        position: 'relative',
        left: expanded ? expandedWidth : collapsedWidth,
        width: `calc(100vw - 20px - ${expanded ? expandedWidth : collapsedWidth }px)`,
        padding: '1px 0 0 20px',
        textAlign: 'left'
      }}>
        { routeResult || <NotFoundPage /> }
      </div>
    </div>
  )
}

export default SourcesTab