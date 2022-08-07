import React, { useRef, forwardRef, useState, useEffect } from 'react';

import Stone from 'components/Stone';
import styled from 'styled/Layout.module.css';
import Header from 'layout/Header';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/react';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import {
  modalFlagState,
  countState,
  userIdState,
  loadingState,
  headerState,
} from '../atoms';
import {
  Outlet,
  useNavigate,
  useLocation,
  useOutletContext,
} from 'react-router-dom';

// import AppStateProvider from 'providers/AppStateProvider';
export default function Layout() {
  const param = useLocation();
  // const currentCount = useRecoilValue(countState); // 읽기 전용!
  const headerRef = useRef(null);

  const loading = useRecoilValue(loadingState);

  const override = css`
    border-color: red;
    background-color: blue !important;
    display: block;
    z-index: 1;
  `;
  let [color, setColor] = useState('#ffffff');

  useEffect(() => {
    console.log(param, '파람즈');
  }, []);
  const [headerS, setHeaderS] = useRecoilState(headerState);
  const location = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('userInfo')) {
      location('/');
    }
  }, []);
  useEffect(() => {
    if (headerRef) setHeaderS(headerRef.current);
  }, [headerRef]);
  // {!sessionStorage.getItem('userInfo') ? (
  //   <>
  //     <Route path="/" exact to="/" element={<Start />}></Route>
  //     <Route
  //       path="*"
  //       to="/"
  //       element={<Navigate replace to="/" />}
  //     ></Route>
  //   </>
  // ) : (
  return (
    <>
      <Header ref={headerRef}></Header>
      {/* <div className={styled.wrap}> */}
      {loading ? (
        <div
          className={styled.loading_wrap}
          style={loading ? { overflow: 'hidden' } : {}}
        >
          <div className={styled.loading}>
            <ClipLoader color={color} css={override} size={150} />
          </div>
        </div>
      ) : null}
      <Outlet />
      {/* </div> */}
    </>
  );
}
