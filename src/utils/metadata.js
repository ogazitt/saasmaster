import React, { useState, useContext } from 'react'
import { useAuth0 } from './react-auth0-wrapper'
import { get } from './api'

export const MetadataContext = React.createContext();
export const useMetadata = () => useContext(MetadataContext);
export const MetadataProvider = ({
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState();
  const { getTokenSilently, impersonatedUser } = useAuth0();

  const loadMetadata = async () => {
    try {
      setLoading(true);
      const token = await getTokenSilently();      
      const [response, error] = await get(token, 'metadata', 
        impersonatedUser ? { impersonatedUser: impersonatedUser } : {});

      if (error || !response.ok) {
        setMetadata(null);
        console.error(`loadMetadata error: ${error}`);
      } else {
        const responseData = await response.json();
        setMetadata(responseData);
      }
  
      setLoading(false);
    } catch (error) {
      console.error(`loadMetadata exception caught: ${error}`);
      setMetadata(null);
      setLoading(false);
    }  
  }

  return (
    <MetadataContext.Provider
      value={{
        loading,
        metadata,
        loadMetadata
      }}>
      {children}
    </MetadataContext.Provider>
  );
};