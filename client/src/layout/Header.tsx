import React, { forwardRef } from 'react';
import styled from 'styled/Header.module.css';
import { useRecoilValue } from 'recoil';
import { useDispatch } from 'react-redux';
import UseAsync from 'utill/useAsync';
import { userIdState, loginFlagState } from '../atoms';
import { logoutUser } from '_actions/user_action';
const Header = forwardRef((props: any, ref: any) => {
  const SearchImg = <div>서취</div>;
  const user = useRecoilValue(userIdState);
  let loginFlag = useRecoilValue(loginFlagState);
  const dispatch = useDispatch();
  const logout = () => {
    sessionStorage.removeItem('userInfo');

    const { execute } = UseAsync(
      () => dispatch(logoutUser({ user_id: id, password })),
      false
    );
  };
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
