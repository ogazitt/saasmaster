import React, { useState, useContext } from 'react'
import { useAuth0 } from './react-auth0-wrapper'
import { get } from './api'

export const ConnectionsContext = React.createContext();
export const useConnections = () => useContext(ConnectionsContext);
export const ConnectionsProvider = ({
  children
}) => {
  const [connections, setConnections] = useState();
  const [loading, setLoading] = useState();
  const { getTokenSilently, impersonatedUser } = useAuth0();

  const loadConnections = async () => {
    try {
      setLoading(true);
      const token = await getTokenSilently();      
      const [response, error] = await get(token, 'connections', 
        impersonatedUser ? { impersonatedUser: impersonatedUser } : {});

      if (error || !response.ok) {
        setConnections(null);
        console.error(`loadConnections error: ${error}`);
      } else {
        const responseData = await response.json();
        setConnections(responseData);
      }  

      setLoading(false);
    } catch (error) {
      console.error(`loadConnections exception caught: ${error}`);
      setConnections(null);
    }  
  };

  return (
    <ConnectionsContext.Provider
      value={{
        loading,
        connections,
        loadConnections,
      }}>
      {children}
    </ConnectionsContext.Provider>
  );
};