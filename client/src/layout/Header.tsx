import React, { forwardRef, useState, useMemo, useEffect } from 'react';
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
  modalDataState,
} from '../atoms';
import { useNavigate } from 'react-router-dom';

import { logoutUser } from '_actions/user_action';
import { exitCode } from 'process';
import { useMatch } from 'react-router-dom';
const Header = forwardRef((props: any, ref: any) => {
  const SearchImg = <div>서취</div>;

  const location = useNavigate();
  const user = useRecoilValue(userIdState);
  const [loginFlag, setLoginFlag] = useRecoilState(loginFlagState);
  const [modalFlag, setModalFlagState] = useRecoilState(modalFlagState);
  const [userName, setUserName] = useRecoilState(userNameState);
  const [modalMsg, setModalMsg] = useState('');

  const dispatch = useDispatch();
  const { execute } = UseAsync(() => dispatch(logoutUser()), false);
  const logout = async () => {
    const res = await execute();
    console.log(res);
    sessionStorage.removeItem('userInfo');
    setUserName('');
    setModalMsg('로그아웃됨');
    return setModalFlagState(true);
  };
  const [modalData, setModalData] = useRecoilState(modalDataState);
  const getModalData = useMemo(() => {
    return {
      ...modalData,
      warnMsg: null,
      button: [
        {
          text: '확인',
          backgroundColor: 'blue',
          color: '#fff',
          func: () => {
            console.log(props, 'props');
            props.locateView('', true);
            setLoginFlag(false);
          },
        },
      ],
      message: modalMsg,
    };
  }, [modalMsg]);
  useEffect(() => {
    setLoginFlag(loginFlag);
  }, [loginFlag]);
  useEffect(() => {
    setModalData(getModalData);
  }, [getModalData]);
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
