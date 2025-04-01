import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers/index.js";
import { thunk } from "redux-thunk";
import "./styles.css"
import { GoogleOAuthProvider } from '@react-oauth/google';

const store = createStore(reducers, compose(applyMiddleware(thunk)))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <React.StrictMode>
            {/* REMOVE THIS CLIENT ID AND USE ENV FILE TO FETCH IT */}
            // <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
                <App />
            // </GoogleOAuthProvider>
        </React.StrictMode>
    </Provider>
);
