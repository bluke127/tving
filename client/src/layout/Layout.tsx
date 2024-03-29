import React, {
  useRef,
  forwardRef,
  useState,
  useEffect,
  Suspense,
  lazy,
} from 'react';

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
  loginFlagState,
  offsetState,
  loadingState,
  headerState,
} from '../atoms';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Modal from 'components/Modal';
// import AppStateProvider from 'providers/AppStateProvider';
export default function Layout() {
  const param = useLocation();
  // const currentCount = useRecoilValue(countState); // 읽기 전용!
  const headerRef = useRef(null);

  const [loading, setLoading] = useRecoilState(loadingState);

  const override = css`
    border-color: red;
    background-color: blue !important;
    display: block;
    z-index: 1;
  `;
  let [color, setColor] = useState('#ffffff');
  const [offset, setOffset] = useRecoilState(offsetState);
  let [loginFlag, setLoginFlag] = useRecoilState(loginFlagState);
  useEffect(() => {
    setLoginFlag((sessionStorage.getItem('userInfo') !== null) as boolean);
    console.log(loginFlag, '바뀌나');
    if (!loginFlag) location('/');
  }, [loginFlag]);
  const locateView = (type: string, logoutFlag = false) => {
    setOffset({ ...offset, selectedOffset: type ?? 'header' });
    // if (param.pathname === '/' || param.pathname === '/register') {
    //   return location(type);
    // }

    if (
      (param.pathname === '/' || param.pathname === '/register') &&
      logoutFlag
    ) {
      return location(type);
    } else if (param.pathname !== '/tving') {
      location('/tving');
    }
  };
  const [headerS, setHeaderS] = useRecoilState(headerState);
  const location = useNavigate();
  useEffect(() => {
    console.log(sessionStorage.getItem('userInfo'));
    setLoginFlag(sessionStorage.getItem('userInfo') !== null);
    // if (param.pathname === '/tving') {
    // console.log(sessionStorage.getItem('userInfo'), 'userInfo');
    if (!loginFlag) {
      location('/');
    }
    // }
    setLoading(false);
  }, []);
  useEffect(() => {
    if (param.pathname !== '/tving') {
      window.scrollTo({ top: 0 });
    }
  }, [param.pathname]);

  useEffect(() => {
    if (headerRef) setHeaderS(headerRef.current);
  }, [headerRef]);
  return (
    <>
      <Modal></Modal>
      <Header
        locateView={locateView}
        ref={headerRef}
        loginFlag={loginFlag}
        param={param}
      ></Header>
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
      <div className={styled.content_wrap}>
        <Outlet context={{ locateView: locateView }} />
      </div>
      {/* </div> */}
    </>
  );
}
