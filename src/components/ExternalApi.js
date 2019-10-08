// src/components/ExternalApi.js

import React, { useState } from "react";
import { useAuth0 } from "../utils/react-auth0-wrapper";
import Highlight from './Highlight';

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently, getIdTokenClaims } = useAuth0();

  const callApi = async () => {

    try {
      const token = await getTokenSilently();
      console.log(`callApi token: ${token}`);
  
      const response = await fetch("http://localhost:8080/timesheets", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error(response);
        return(<div/>);
      }

      const responseData = await response.json();

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
      return(<div/>);
    }
  };

  return (
    <>
      <h1>External API</h1>
      <button onClick={callApi}>Ping API</button>
      <br/>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
    </>
  );
};

export default ExternalApi;