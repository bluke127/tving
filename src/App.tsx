import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from 'pages/Login';
import Layout from 'layout/Layout.jsx';

import Details from 'pages/Details';
import Tving from 'pages/Tving';
import { useNavigate } from 'react-router-dom';
import NotFound from 'pages/NotFound';
import { modalFlagState, countState, userIdState, headerState } from './atoms';

import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import initStyle from 'styled/init.module.css';
import 'styled/App.css';
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <>
            <Route path="/" element={<Start />}></Route>
            <Route path="/main" element={<Layout />}>
              <Route path="" element={<Tving />}></Route>
              <Route path=":type/:id" element={<Details />}></Route>
            </Route>
            <Route path="/main" element={<Layout />}>
              <Route path="tving" element={<Tving />}></Route>
            </Route>
            <Route path="*" element={<NotFound />}></Route>
          </>
        </Routes>
      </BrowserRouter>
    </>
  );
}
