import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from 'pages/Login';
import Tving from 'pages/Tving';
import NotFound from 'pages/NotFound';
import initStyle from 'styled/init.module.css';
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />}></Route>
          <Route path="/tving" element={<Tving />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
