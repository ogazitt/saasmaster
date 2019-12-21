import React, { useState } from 'react'
import { useRoutes, navigate, useRedirect } from 'hookrouter'

// side nav control and styles
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'

// import pages
import HomePage from '../pages/HomePage'
import AlertsPage from '../pages/AlertsPage'
import HistoryPage from '../pages/HistoryPage'
import NotFoundPage from '../pages/NotFoundPage'

const ReputationTab = () => {
  // create state variables for current path (which determines selected tab) and expanded state
  const currentPath = window.location.pathname;
  const [expanded, setExpanded] = useState(false);
  console.log(`reputation currentPath: ${currentPath}`)

  // constants that describe the top offset (to honor NavBar) and SidNav width
  const expandedWidth = 200;
  const collapsedWidth = 64;
  const topOffset = 50;

  const selectTab = (selected) => {
    navigate(`${selected}`)
  }

  // define routes
  const routes = {
    '/': () => <HomePage />,
    '/home': () => <HomePage />,
    '/alerts': () => <AlertsPage />,
    '/history': () => <HistoryPage />,
  };

  useRedirect('/', '/reputation/home');
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
            <NavItem eventKey="/reputation/home">
              <NavIcon>
                <i className="fa fa-fw fa-pie-chart" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText">Dashboard</NavText>
            </NavItem>
            <NavItem eventKey="/reputation/alerts">
              <NavIcon>
                <i className="fa fa-fw fa-bell" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText">Alerts</NavText>
            </NavItem>
            <NavItem eventKey="/reputation/history">
              <NavIcon>
                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText">History</NavText>
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

export default ReputationTab
