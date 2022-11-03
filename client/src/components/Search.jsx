import React, {
  Component,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import styled from 'styled/Search.module.css';

import { loadingState } from '../atoms';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import BaseInput from 'components/BaseInput';
export default function Search({
  searchType,
  handleSearchkeword,
  searchKeyword,
  searchEvent,
}) {
  const [searchWidth, setSearchWidth] = useState(0);
  const setWidth = () => {
    searchWidth !== 0 ? setSearchWidth(0) : setSearchWidth('150px');
  };

  return (
    <div className={styled.search_img}>
      <div onClick={setWidth}>
        <img
          src={require('../assets/images/search.svg').default}
          alt="search"
        />
      </div>
      <BaseInput
        style={{ width: searchWidth }}
        value={searchKeyword}
        className={styled.search_input}
        onInput={handleSearchkeword}
        onKeyPress={searchEvent}
      ></BaseInput>
    </div>
  );
}
