import React, { useState, useEffect, useContext } from "react";
import { useAuth0 } from "../utils/react-auth0-wrapper";

export const ConnectionsContext = React.createContext();
export const useConnections = () => useContext(ConnectionsContext);
export const ConnectionsProvider = ({
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [connections, setConnections] = useState();

  const { getTokenSilently } = useAuth0();

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
      
      // construct API service URL
      const baseUrl = window.location.origin;
      const urlObject = new URL(baseUrl);

      // replace port for local development from 3000 to 8080
      if (urlObject.port && urlObject.port > 80) {
        urlObject.port = 8080;
      }

      const url = urlObject + 'connections';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const responseData = await response.json();
        setConnections(responseData);
        setLoaded(true);
      } else {
        console.error(`loadConnections error: ${response}`);
        setConnections({});
        setLoaded(false);
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