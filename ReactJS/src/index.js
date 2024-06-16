import React from "react";  
import './index.css';
import App from "./App";
import ReactDOM from 'react-dom/client'; 
import { GoogleOAuthProvider } from '@react-oauth/google';

import { BrowserRouter } from "react-router-dom";
const clientId="1014862725084-c4jjkvtjo43m36nb45u27g2jvel9eo3l.apps.googleusercontent.com";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
  <BrowserRouter>
  <App/>
  </BrowserRouter>
  </GoogleOAuthProvider>
);
