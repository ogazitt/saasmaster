import React, { useState } from 'react';

import 'font-awesome/css/font-awesome.min.css';

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import { useRoutes, navigate } from 'hookrouter';
import HomePage from './HomePage'
import AboutPage from './AboutPage'
import NotFoundPage from './NotFoundPage'

const routes = {
  '/': () => <HomePage />,
  '/home': () => <HomePage />,
  '/about': () => <AboutPage />,
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
              <NavItem eventKey="about">
                  <NavIcon>
                      <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                      Charts
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
