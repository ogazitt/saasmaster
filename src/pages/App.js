import React, { useState } from 'react';
import './App.css';

// Top Navbar
import StickyNavbar from '../components/StickyNavbar';

// Tabs contain the complete control tree 
import BusinessTab from '../components/BusinessTab';
import EmployeesTab from '../components/EmployeesTab';

// Profile page
import ProfilePage from './ProfilePage';

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
    <div>
      <StickyNavbar
          state={state}
          actions={actions}
      />
      <div style={{
            position: 'relative',
            top: '40px',
            height: 'calc(100vh - 40px)',
            //width: 'calc(100vw - 140px)'
            width: '100vw'
        }}>

        {state.tab === 'business' &&
          <BusinessTab />
        }
        {state.tab === 'employees' &&
          <EmployeesTab />
        }
        {state.tab === 'profile' &&
          <ProfilePage />
        }
      </div>
  </div>
  );
}

export default App;
