import React from 'react';
import ReactDOM from 'react-dom';
// Components
import App from './App';
// Utils
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import reportWebVitals from './reportWebVitals';
// Styles
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

require('dotenv').config()

//window.Buffer = window.Buffer || require("buffer").Buffer;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
