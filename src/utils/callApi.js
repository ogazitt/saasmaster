const callApi = async (token, path, headers = {}) => { 

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

    const response = await fetch(url, {
      headers: headers
    });
    
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

export default callApi;