import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/redux-store";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

ReactDOM.render(
        <BrowserRouter>
            <Provider store={store}>
            <App/>
            </Provider>
        </BrowserRouter>,
    document.getElementById('root')
);
