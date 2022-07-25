import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import axios from 'axios';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
  <RecoilRoot>
    <App />
  </RecoilRoot>
  // </React.StrictMode>
);
(document.getElementById('root') as HTMLElement).style.height = '100%';
