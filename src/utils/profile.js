import React, { useState, useContext } from 'react'
import { useAuth0 } from './react-auth0-wrapper'
import { get, post } from './api'

export const ProfileContext = React.createContext();
export const useProfile = () => useContext(ProfileContext);
export const ProfileProvider = ({
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState();
  const { getTokenSilently, impersonatedUser } = useAuth0();

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = await getTokenSilently();      
      const [response, error] = await get(token, 'profile', 
        impersonatedUser ? { impersonatedUser: impersonatedUser } : {});

      if (error || !response.ok) {
        setProfile(null);
        console.error(`loadProfile error: ${error}`);
      } else {
        const responseData = await response.json();
        setProfile(responseData);
      }
  
      setLoading(false);
    } catch (error) {
      console.error(`loadProfile exception caught: ${error}`);
      setProfile(null);
      setLoading(false);
    }  
  }

  const storeProfile = async () => {
    try {
      // create a copy of the profile that only includes data that can be changed by the profile page
      const data = { 
        name: profile.name,
        email: profile.email,
        skipTour: profile.skipTour,
        expanded: profile.expanded
      };

      // post the profile endpoint with the new profile information
      const token = await getTokenSilently();
      const [response, error] = await post(token, 'profile', JSON.stringify(data),
        impersonatedUser ? { impersonatedUser: impersonatedUser } : {});

      if (error || !response.ok) {
        console.error(`storeProfile error: ${error}`);
      } 
    } catch (error) {
      console.error(`storeProfile exception caught: ${error}`);
    }  
  }

  return (
    <ProfileContext.Provider
      value={{
        loading,
        profile,
        loadProfile,
        storeProfile
      }}>
      {children}
    </ProfileContext.Provider>
  );
};