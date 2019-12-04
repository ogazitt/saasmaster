import React, { useState } from 'react';
import { useRoutes, navigate } from 'hookrouter';

// side nav control and styles
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

// import pages
import HomePage from '../pages/HomePage'
import ConnectionsPage from '../pages/ConnectionsPage'
import NotFoundPage from '../pages/NotFoundPage'

// import data provider pages
import GooglePage from '../providers/Google'
import FacebookPage from '../providers/Facebook'
import TwitterPage from '../providers/Twitter'
import InstagramPage from '../providers/Instagram'

// define routes
const routes = {
  '/': () => <HomePage />,
  '/home': () => <HomePage />,
  '/google': () => <GooglePage />,
  '/facebook': () => <FacebookPage />,
  '/instagram': () => <InstagramPage />,
  '/twitter': () => <TwitterPage />,
  '/conns': () => <ConnectionsPage />,
/*    '/products': () => <ProductOverview />,
    '/products/:id': ({id}) => <ProductDetails id={id} />*/
};

const BusinessTab = () => {
  // create state variables for selected tab and expanded state
  const currentPath = window.location.pathname;
  const [selected, setSelected] = useState(currentPath === '/' ? 'home' : currentPath.substring(1));
  const [expanded, setExpanded] = useState(false);
  const expandedWidth = 180;
  const collapsedWidth = 64;

  const routeResult = useRoutes(routes);

  const selectTab = (selected) => {
    setSelected(selected)
    navigate(`/${selected}`)
  }

  return (
    <div>  
      <div style={{
        width: expanded ? expandedWidth : collapsedWidth,
        position: 'fixed', 
        left: 0,
        top: 40,
        height: 'calc(100vh - 40px)',
        }}>
        <SideNav
          onSelect={ selectTab }
          onToggle={ (expanded) => {
            setExpanded(expanded)
          }}>
          <SideNav.Toggle />
          <SideNav.Nav defaultSelected={selected}>
            <NavItem eventKey="home">
              <NavIcon>
                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText className="navText">Website</NavText>
            </NavItem>
            <NavItem eventKey="google">
              <NavIcon>
                <i className="fa fa-fw fa-google" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>Google</NavText>
            </NavItem>
            <NavItem eventKey="facebook">
              <NavIcon>
                <i className="fa fa-fw fa-facebook" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>Facebook</NavText>
            </NavItem>
            <NavItem eventKey="instagram">
              <NavIcon>
                <i className="fa fa-fw fa-instagram" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>Instagram</NavText>
            </NavItem>
            <NavItem eventKey="twitter">
              <NavIcon>
                <i className="fa fa-fw fa-twitter" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>Twitter</NavText>
            </NavItem>
            <NavItem eventKey="conns">
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
        width: `calc(100vw - 140px - ${expanded ? expandedWidth : collapsedWidth }px)`,
        padding: '1px 0 0 20px',
        textAlign: 'left'
      }}>
        { routeResult || <NotFoundPage /> }
      </div>
    </div>
  );
}

export default BusinessTab;
