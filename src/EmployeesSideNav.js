import React from 'react';

import 'font-awesome/css/font-awesome.min.css';

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class EmployeesSideNav extends React.Component {
  render() {
    const name = 'React SideNav';
    const url = 'https://github.com/trendmicro-frontend/react-sidenav';
    console.log('rendering EmployeesSideNav.js');

    return (
        <SideNav
      onSelect={(selected) => {
              console.log('EmployeesSideNav::onSelect')
              // Add your code here
          }}>
          <SideNav.Toggle />
          <SideNav.Nav defaultSelected="home">
              <NavItem eventKey="home">
                  <NavIcon>
                      <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                      Dashboard
                  </NavText>
              </NavItem>
              <NavItem eventKey="charts">
                  <NavIcon>
                      <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
                  </NavIcon>
                  <NavText>
                      Charts
                  </NavText>
                  <NavItem eventKey="charts/linechart">
                      <NavText>
                          Line Chart
                      </NavText>
                  </NavItem>
                  <NavItem eventKey="charts/barchart">
                      <NavText>
                          Bar Chart
                      </NavText>
                  </NavItem>
              </NavItem>
            </SideNav.Nav>
        </SideNav>
    );
  }
}
export default EmployeesSideNav;
