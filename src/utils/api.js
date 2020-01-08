// make api calls against the backend
// exports:
//   get - make a get call
//   post - make a post call
//   useApi - a React effect that returns { get, post }
//   [note: using the useApi effect is the proper way to structure API calls going forward]

import { useCallback } from 'react'
import { useAuth0 } from '../utils/react-auth0-wrapper'

export async function get(token, path, headers = {}, forceRefresh = false) { 
  // construct API service URL
  const baseUrl = window.location.origin;
  const urlObject = new URL(baseUrl);

  // replace port for local development from 3000 to 8080
  if (urlObject.port && urlObject.port > 80) {
    urlObject.port = 8080;
  }

  const urlPath = urlObject + path,
  url = forceRefresh ? `${urlPath}?refresh=true` : urlPath; 

  headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(url, {
      headers: headers
    });
    
    return [response, null];
  } catch (error) {
    console.error(`GET ${url}: ${error}`);
    return [null, error];
  }
}

export async function post(token, path, data, headers = {}) { 
  try {
    // construct API service URL
    const baseUrl = window.location.origin;
    const urlObject = new URL(baseUrl);

    // replace port for local development from 3000 to 8080
    if (urlObject.port && urlObject.port > 80) {
      urlObject.port = 8080;
    }

    const url = urlObject + path;
    headers.Authorization = `Bearer ${token}`;
    headers['Content-Type'] = 'application/json';

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: data
    });
    
    if (response.error) {
      console.log(`post: received response ${response.error}`);
    }
    
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
}

// define a custom effect that wraps the auth0 effect, gets a token, and calls the API method
export function useApi() {
  const { getTokenSilently, impersonatedUser } = useAuth0();

  // create a callback around the GET call
  const callGet = useCallback((...p) => {
    async function callGet(path, headers = {}, forceRefresh = false) {
      const token = await getTokenSilently();
      if (impersonatedUser) {
        headers.impersonatedUser = impersonatedUser;
      }
      return await get(token, path, headers, forceRefresh);
    }
    return callGet(...p);
  }, [getTokenSilently, impersonatedUser]);

  // create a callback around the POST call
  const callPost = useCallback((...p) => {
    async function callPost(...p) {
      const token = await getTokenSilently();
      return await post(token, ...p);
    }
    return callPost(...p);
  }, [getTokenSilently]);

  return {
    get: callGet,
    post: callPost
  }
}
