import React, { forwardRef } from 'react';
import Stone from 'components/Stone';
import styled from 'styled/Header.module.css';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  modalFlagState,
  countState,
  userIdState,
  loginFlagState,
} from '../atoms';
import BaseInput from 'components/BaseInput';
const Header = forwardRef((props: any, ref: any) => {
  const SearchImg = <div>서취</div>;
  const user = useRecoilValue(userIdState);
  let loginFlag = useRecoilValue(loginFlagState);
  return (
    <div className={styled.header_wrap} ref={ref}>
      {loginFlag ? (
        <ul>
          <li>
            <h1>Tving</h1>
          </li>
          <li onClick={() => props.locateView('movie')}>영화</li>
          <li onClick={() => props.locateView('tv')}>Tv</li>
          <li>저장리스트</li>
          <li>{user} 님 환영합니다.</li>
        </ul>
      ) : (
        <ul>
          {props.param.pathname !== '/' ? (
            <li onClick={() => props.locateView('')}>로그인</li>
          ) : (
            <li onClick={() => props.locateView('register')}>회원가입</li>
          )}
        </ul>
      )}
    </div>
  );
});

export default Header;
