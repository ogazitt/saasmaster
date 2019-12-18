import React from 'react'
import { useRoutes } from 'hookrouter'

// Other pages
import LandingPage from './LandingPage'
import PrivacyPage from './PrivacyPage'
import NotFoundPage from './NotFoundPage'

// define routes
const routes = {
  '/': () => <LandingPage />,
  '/privacy': () => <PrivacyPage />,
};

const Website = () => {
  const routeResult = useRoutes(routes);
  return (routeResult || <NotFoundPage />)
}

export default Website
