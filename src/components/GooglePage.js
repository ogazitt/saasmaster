import React from 'react'
import GoogleCard from './GoogleCard'
import ProviderPage from './ProviderPage'

const GooglePage = () => {
  return ProviderPage({ 
    providerName: 'Google',
    connectionName: 'google-oauth2',
    endpoint: 'google',
    dataIndex: 'items',
    card: GoogleCard
  })
}

export default GooglePage