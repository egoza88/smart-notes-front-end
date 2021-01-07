import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const firebase = require('firebase');
require('firebase/firestore');

firebase.default.initializeApp({
  apiKey: "AIzaSyDGgZq-BmfJQf-ZPvU-Wad9doCWBpQnFcw",
  authDomain: "note-taker-aa02f.firebaseapp.com",
  projectId: "note-taker-aa02f",
  storageBucket: "note-taker-aa02f.appspot.com",
  messagingSenderId: "439210903946",
  appId: "1:439210903946:web:489862ea77d7bce238e073"
});

ReactDOM.render(<App />, document.getElementById('evernote-container'));

serviceWorker.unregister();
