import React, { useState, useContext } from 'react'
import { useAuth0 } from './react-auth0-wrapper'
import { get } from './api'

export const MetadataContext = React.createContext();
export const useMetadata = () => useContext(MetadataContext);
export const MetadataProvider = ({
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [metadata, setMetadata] = useState();

  const { getTokenSilently } = useAuth0();

  const loadMetadata = async () => {

    try {
      setLoading(true);
      const token = await getTokenSilently();
      
      const [response, error] = await get(token, 'metadata');

      if (error || !response.ok) {
        setMetadata({});
        console.error(`loadMetadata error: ${error}`);
        setLoaded(false);
      } else {
        const responseData = await response.json();
        setMetadata(responseData);
        setLoaded(true);
      }
  
      setLoading(false);
    } catch (error) {
      console.error(`loadMetadata exception caught: ${error}`);
      setMetadata({});
      setLoaded(false);
      setLoading(false);
    }  
  };

  return (
    <MetadataContext.Provider
      value={{
        loaded,
        metadata,
        loading,
        loadMetadata
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};