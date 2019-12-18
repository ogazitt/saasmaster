import React from 'react'
import { useRoutes } from 'hookrouter'

// Other pages
import LandingPage from './LandingPage'
import PrivacyPage from './PrivacyPage'
import TermsPage from './TermsPage'
import NotFoundPage from './NotFoundPage'

// define routes
const routes = {
  '/': () => <LandingPage />,
  '/privacy': () => <PrivacyPage />,
  '/terms': () => <TermsPage />,
};

const Website = () => {
  const routeResult = useRoutes(routes);
  return (routeResult || <NotFoundPage />)
}

export default Website
