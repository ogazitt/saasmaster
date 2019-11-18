import React from 'react'
import FacebookCard from './FacebookCard'
import ProviderPage from './ProviderPage'

const FacebookPage = () => {
  return ProviderPage({ 
    providerName: 'Facebook',
    connectionName: 'facebook',
    endpoint: 'facebook',
    dataIndex: 'data',
    card: FacebookCard
  })
}

export default FacebookPage
