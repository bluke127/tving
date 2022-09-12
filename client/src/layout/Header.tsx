import React, { forwardRef, useState } from 'react';
import styled from 'styled/Header.module.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useDispatch } from 'react-redux';
import UseAsync from 'utill/useAsync';

import Modal from 'components/Modal';
import {
  userIdState,
  loginFlagState,
  userNameState,
  modalFlagState,
} from '../atoms';
import { logoutUser } from '_actions/user_action';
import { exitCode } from 'process';
const Header = forwardRef((props: any, ref: any) => {
  const SearchImg = <div>서취</div>;
  const user = useRecoilValue(userIdState);
  let loginFlag = useRecoilValue(loginFlagState);
  const [modalFlag, setModalFlagState] = useRecoilState(modalFlagState);
  const [userName, setUserName] = useRecoilState(userNameState);
  const [modalMsg, setModalMsg] = useState('');
  const { execute } = UseAsync(() => dispatch(logoutUser()), false);

  const dispatch = useDispatch();
  const logout = () => {
    execute();
    sessionStorage.removeItem('userInfo');
    setUserName('');
    setModalMsg('로그아웃됨');
    return setModalFlagState(true);
  };
  return (
    <div className={styled.header_wrap} ref={ref}>
      <Modal
        warnMsg={modalMsg}
        button={[
          {
            text: '확인',
            backgroundColor: 'blue',
            color: '#fff',
            func: () => props.locateView(''),
          },
        ]}
      ></Modal>
      {loginFlag ? (
        <ul>
          <li>
            <h1>Tving</h1>
          </li>
          <li onClick={() => props.locateView('movie')}>영화</li>
          <li onClick={() => props.locateView('tv')}>Tv</li>
          <li>저장리스트</li>
          <li>{userName} 님 환영합니다.</li>
          <li onClick={() => logout()}>로그아웃</li>
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
