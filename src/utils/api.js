// make api calls against the backend
// exports:
//   get - make a get call
//   post - make a post call

exports.get = async (token, path, forceRefresh = false, headers = {}) => { 
  try {
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

    const response = await fetch(url, {
      headers: headers
    });
    
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

exports.post = async (token, path, data) => { 
  try {
    // construct API service URL
    const baseUrl = window.location.origin;
    const urlObject = new URL(baseUrl);

    // replace port for local development from 3000 to 8080
    if (urlObject.port && urlObject.port > 80) {
      urlObject.port = 8080;
    }

    const url = urlObject + path;
    const headers = {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    };

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
};