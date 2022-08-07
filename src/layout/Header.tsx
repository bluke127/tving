import React, { forwardRef } from 'react';
import Stone from 'components/Stone';
import styled from 'styled/Header.module.css';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import { modalFlagState, countState, userIdState } from '../atoms';
import BaseInput from 'components/BaseInput';
const Header = forwardRef((props, ref: any) => {
  const SearchImg = <div>서취</div>;
  return (
    <div className={styled.header_wrap} ref={ref}>
      <ul>
        <li>
          <h1>Tving</h1>
        </li>
        <li>Tv</li>
        <li>영화</li>
        <li>저장리스트</li>
        <li>{useRecoilValue(userIdState)} 님 환영합니다.</li>
      </ul>
    </div>
  );
});

export default Header;
