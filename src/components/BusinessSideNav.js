import React, { useState } from 'react';
import { useRoutes, navigate } from 'hookrouter';

import 'font-awesome/css/font-awesome.min.css';

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

// import pages
import HomePage from '../pages/HomePage'
import ConnectionsPage from '../pages/ConnectionsPage'
import NotFoundPage from '../pages/NotFoundPage'

// import data provider pages
import GooglePage from '../providers/Google'
import FacebookPage from '../providers/Facebook'

// define routes
const routes = {
  '/': () => <HomePage />,
  '/home': () => <HomePage />,
  '/google': () => <GooglePage />,
  '/facebook': () => <FacebookPage />,
  '/conns': () => <ConnectionsPage />,
/*    '/products': () => <ProductOverview />,
    '/products/:id': ({id}) => <ProductDetails id={id} />*/
};

// https://fb.me/react-invalid-hook-call

const BusinessSideNav = () => {
    // create state variables for selected tab and expanded state
    const [selected, setSelected] = useState('home')
    const [expanded, setExpanded] = useState(false)

    const routeResult = useRoutes(routes);

    return (
      <div>  
        <SideNav
            onSelect={(selected) => {
              setSelected(selected)
              navigate(`/${selected}`)
              // Add your code here
          }}
            onToggle={(expanded) => {
              setExpanded(expanded)
              // Add your code here
          }}>
          <SideNav.Toggle />
          <SideNav.Nav defaultSelected={selected}>
              <NavItem eventKey="home">
                  <NavIcon>
                      <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                      Website
                  </NavText>
              </NavItem>
              <NavItem eventKey="google">
                  <NavIcon>
                      <i className="fa fa-fw fa-google" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                      Google
                  </NavText>
              </NavItem>
              <NavItem eventKey="facebook">
                  <NavIcon>
                      <i className="fa fa-fw fa-facebook" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                      Facebook
                  </NavText>
              </NavItem>
              <NavItem eventKey="conns">
                  <NavIcon>
                      <i className="fa fa-fw fa-cog" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                      Connections
                  </NavText>
              </NavItem>
            </SideNav.Nav>
        </SideNav>
        <div style={{
          marginLeft: expanded ? 240 : 64,
          padding: '1px 0 0 20px',
          textAlign: 'left'
        }}>
          { routeResult || <NotFoundPage /> }
        </div>

      </div>
    );
  }
//}
export default BusinessSideNav;
