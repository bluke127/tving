import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';

import 'antd/dist/antd.css';
import promiseMiddleware from 'redux-promise';

import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const creatStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);
root.render(
  <Provider
    store={creatStoreWithMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Provider>
);
(document.getElementById('root') as HTMLElement).style.height = '100%';
