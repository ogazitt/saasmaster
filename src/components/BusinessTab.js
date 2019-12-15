import React, { useState } from 'react'
import { useRoutes, navigate } from 'hookrouter'

// side nav control and styles
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'

// import pages
import HomePage from '../pages/HomePage'
import ConnectionsPage from '../pages/ConnectionsPage'
import AlertsPage from '../pages/AlertsPage'
import NotFoundPage from '../pages/NotFoundPage'

// import data provider pages
import GooglePage from '../providers/Google'
import FacebookPage from '../providers/Facebook'
import TwitterPage from '../providers/Twitter'
import InstagramPage from '../providers/Instagram'
import HistoryPage from '../pages/HistoryPage'

const BusinessTab = () => {
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
    '/business': () => <HomePage />,
    '/business/home': () => <HomePage />,
    '/business/alerts': () => <AlertsPage />,
    '/business/history': () => <HistoryPage />,
    '/business/google': () => <GooglePage />,
    '/business/facebook': () => <FacebookPage />,
    '/business/instagram': () => <InstagramPage />,
    '/business/twitter': () => <TwitterPage />,
    '/business/conns': () => <ConnectionsPage />,
  };

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
          <NavItem eventKey="/business/home">
              <NavIcon>
                <i className="fa fa-fw fa-pie-chart" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText">Dashboard</NavText>
            </NavItem>
            <NavItem eventKey="/business/alerts">
              <NavIcon>
                <i className="fa fa-fw fa-bell" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText">Alerts</NavText>
            </NavItem>
            <NavItem eventKey="/business/history">
              <NavIcon>
                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText">History</NavText>
            </NavItem>
            <NavItem eventKey="/business/google">
              <NavIcon>
                <i className="fa fa-fw fa-google" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>Google</NavText>
            </NavItem>
            <NavItem eventKey="/business/facebook">
              <NavIcon>
                <i className="fa fa-fw fa-facebook" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>Facebook</NavText>
            </NavItem>
            <NavItem eventKey="/business/instagram">
              <NavIcon>
                <i className="fa fa-fw fa-instagram" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>Instagram</NavText>
            </NavItem>
            <NavItem eventKey="/business/twitter">
              <NavIcon>
                <i className="fa fa-fw fa-twitter" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>Twitter</NavText>
            </NavItem>
            <NavItem eventKey="/business/conns">
              <NavIcon>
                <i className="fa fa-fw fa-cog" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>Connections</NavText>
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

export default BusinessTab
