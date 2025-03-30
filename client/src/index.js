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
            <GoogleOAuthProvider clientId="753487592976-9f1s9qq83228vvdigoq2unnh7vlfhk3q.apps.googleusercontent.com">
                <App />
            </GoogleOAuthProvider>
        </React.StrictMode>
    </Provider>
);
