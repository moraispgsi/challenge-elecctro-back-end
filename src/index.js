import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import createEngine from 'redux-storage-engine-localstorage';
import logger from 'redux-logger';
import * as storage from 'redux-storage'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';
import rootReducer from './reducers';
import merger from 'redux-storage-merger-immutablejs';
import App from './App';
import bg from './img/bg.jpg'
import './css/index.css';

//Configure the store to be saved and loaded from the local storage(Web Storage)
const engine = createEngine('tasks');
const reducer = storage.reducer(rootReducer, merger);
const middleware = storage.createMiddleware(engine);
const createStoreWithMiddleware = applyMiddleware(middleware)(createStore);
const store = createStoreWithMiddleware(reducer, applyMiddleware(logger), applyMiddleware(thunk));
const load = storage.createLoader(engine);
load(store);

ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>,
  document.getElementById('root'));

document.getElementsByTagName("BODY")[0].style.backgroundImage = `url('${bg}')`;
registerServiceWorker();
