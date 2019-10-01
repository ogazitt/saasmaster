import React from 'react';
import logo from './logo.svg';
import './App.css';
/*import './Navbar.jsx';
import { Button } from '@trendmicro/react-buttons';
import navbarStyles from './Navbar.styl';*/

import 'font-awesome/css/font-awesome.min.css';

// React Navbar
import StickyNavbar from './StickyNavbar';

import BusinessSideNav from './BusinessSideNav';
import EmployeesSideNav from './EmployeesSideNav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import '@trendmicro/react-navs/dist/react-navs.css';
import '@trendmicro/react-navbar/dist/react-navbar.css';

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class App extends React.Component {
  state = {
    tab: 'business'
  };
  actions = {
    selectTab: (eventKey, event) => {
        console.log('App::selectTab: eventKey=' + eventKey)
        if (!eventKey) {
            return;
        }

        const tab = eventKey.replace(/\..+/g, '');
        this.setState({ tab });
        console.log('App::selectTab: action: ' + tab)
    }
  };

  render() {
    const name = 'React SideNav';
    const url = 'https://github.com/trendmicro-frontend/react-sidenav';
    console.log('rendering App.js');

    return (
      <div className="App">
{/*}
        <header className="App-header">
          <a href="/"><img src={logo} className="App-logo" alt="logo" /></a>
        </header>
    {*/}
          <StickyNavbar
              state={this.state}
              actions={this.actions}
          />
        <div style={{
                        position: 'relative',
                        height: 'calc(100vh - 40px)',
                        width: 'calc(100vh - 140px)'
                    }}>

            {this.state.tab === 'business' &&
              <BusinessSideNav />
            }
            {this.state.tab === 'employees' &&
              <EmployeesSideNav />
            }
        </div>
    </div>
  );
}
}

export default App;
