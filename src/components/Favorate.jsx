import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled/Favorate.module.css';
import Img from 'components/Img';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

export default function Favorate(props) {
  const [active, setActive] = useState(false);
  const activeFlag = useMemo(() => active, [active]);
  return (
    <>
      {activeFlag}
      <span
        className={styled.img}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <Img
          className={styled.favorate_img}
          {...props}
          isapiresponse={+true}
          src={
            !props.favorate && !activeFlag
              ? require('assets/images/favorite.svg').default
              : require('assets/images/favorite-active.svg').default
          }
        />
      </span>
    </>
  );
}
