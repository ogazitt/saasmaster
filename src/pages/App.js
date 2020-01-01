import React, { useState } from 'react'
import { useRoutes, navigate, useRedirect } from 'hookrouter'
import { useProfile } from '../utils/profile'
import './App.css'

// Top Navbar
import StickyNavbar from '../components/StickyNavbar'

// Tabs contain the complete control tree 
import ReputationTab from '../components/ReputationTab'
import SourcesTab from '../components/SourcesTab'

// Other pages
import ProfilePage from './ProfilePage'
import AdminPage from './AdminPage'
import TourPage from './TourPage'
import NotFoundPage from './NotFoundPage'

// define routes
const routes = {
  '/reputation*': () => <ReputationTab />,
  '/sources*': () => <SourcesTab />,
  '/profile': () => <ProfilePage />,
  '/tour': () => <TourPage />,
  '/admin': () => <AdminPage />,
};

const App = () => {
  const { profile, loading } = useProfile();
  // grab the current URL path and extract the active tab from the path
  const currentPath = window.location.pathname;
  const activeTab = `/${currentPath.split('/')[1]}`;
  const [state, setState] = useState( { tab: activeTab } );

  // change the state variable to match the tab extracted from the current URL path
  if (state.tab !== activeTab) {
    setState({ tab: activeTab })
  }

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

  if (currentPath === '/') {
    if (profile && profile.skipTour) {
      navigate('/reputation')
    } else {
      navigate('/tour')
    }
  }

  // useRedirect('/', '/reputation');

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
