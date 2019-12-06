import React, { useState } from 'react'
import { useRoutes, navigate, useRedirect } from 'hookrouter'
import './App.css'

// Top Navbar
import StickyNavbar from '../components/StickyNavbar'

// Tabs contain the complete control tree 
import BusinessTab from '../components/BusinessTab'
import EmployeesTab from '../components/EmployeesTab'

// Other pages
import ProfilePage from './ProfilePage'
import NotFoundPage from './NotFoundPage'

// define routes
const routes = {
  '/business/:page': ({page}) => <BusinessTab />,
  '/employees': () => <EmployeesTab />,
  '/profile': () => <ProfilePage />,
};

const App = () => {
  const [state, setState] = useState( { tab: '/business' } );
  const [actions] = useState({
    selectTab: (eventKey) => {
      if (!eventKey) {
        return;
      }

      const tab = eventKey.replace(/\..+/g, '');
      setState({ tab: tab });
      navigate(tab);
    }
  });

  useRedirect('/', '/business/home');
  useRedirect('/business', '/business/home');
  const routeResult = useRoutes(routes);

  // offset from top to honor the height of the StickyNavbar
  const topOffset = 50;

  return (
    <div>
      <StickyNavbar
          state={state}
          actions={actions}
      />
      <div style={{
            position: 'relative',
            top: topOffset,
            height: `calc(100vh - ${topOffset}px)`,
            width: '100vw'
        }}>
        { routeResult || <NotFoundPage /> }
      </div>
  </div>
  )
}

export default App
