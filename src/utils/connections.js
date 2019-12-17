import React, { useState, useEffect, useContext } from 'react'
import { useAuth0 } from './react-auth0-wrapper'
import { get } from './api'

export const ConnectionsContext = React.createContext();
export const useConnections = () => useContext(ConnectionsContext);
export const ConnectionsProvider = ({
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [connections, setConnections] = useState();
  const { getTokenSilently, impersonatedUser } = useAuth0();

  // use an effect to automatically load connection data on first use
  useEffect(() => {
    /* disable for now
    if (!loading && !isLoaded) {
      loadConnections();
    }
    */
    // eslint-disable-next-line
  }, []);

  const loadConnections = async () => {

    try {
      setLoading(true);
      const token = await getTokenSilently();
      
      const [response, error] = await get(token, 'connections', 
        impersonatedUser ? { impersonatedUser: impersonatedUser } : {});

      if (error || !response.ok) {
        setConnections({});
        console.error(`loadConnections error: ${error}`);
        setLoaded(false);
      } else {
        const responseData = await response.json();
        setConnections(responseData);
        setLoaded(true);
      }
  
      setLoading(false);
    } catch (error) {
      console.error(`loadConnections exception caught: ${error}`);
      setConnections({});
      setLoaded(false);
      setLoading(false);
    }  
  };

  return (
    <ConnectionsContext.Provider
      value={{
        loaded,
        connections,
        loading,
        loadConnections,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
};