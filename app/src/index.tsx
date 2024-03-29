import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './shared/utils/i18n';
import * as serviceWorker from './serviceWorker';
import {defineCustomElements} from "@ionic/pwa-elements/loader";
import axios from 'axios';

axios.defaults.withCredentials = true;

ReactDOM.render(<App />, document.getElementById('root'));

defineCustomElements(window);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
