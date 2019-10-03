import React, { useState } from 'react';
import './App.css';

import 'font-awesome/css/font-awesome.min.css';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import '@trendmicro/react-navs/dist/react-navs.css';
import '@trendmicro/react-navbar/dist/react-navbar.css';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

// React Navbar
import StickyNavbar from './components/StickyNavbar';

import BusinessSideNav from './components/BusinessSideNav';
import EmployeesSideNav from './components/EmployeesSideNav';

const App = () => {
  const [state, setState] = useState({ tab: 'business' });
  const [actions] = useState({
    selectTab: (eventKey, event) => {
      if (!eventKey) {
        return;
      }

      const tab = eventKey.replace(/\..+/g, '');
      setState({ tab });
    }
  });

  return (
    <div className="App">
      <StickyNavbar
          state={state}
          actions={actions}
      />
      <div style={{
            position: 'relative',
            height: 'calc(100vh - 40px)',
            width: 'calc(100vh - 140px)'
        }}>

        {state.tab === 'business' &&
          <BusinessSideNav />
        }
        {state.tab === 'employees' &&
          <EmployeesSideNav />
        }
      </div>
  </div>
  );
}

export default App;
