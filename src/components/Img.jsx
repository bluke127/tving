import React, { useEffect, useState, useRef, useMemo, forwardRef } from 'react';
// import styled from 'styled/Modal.module.css';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import styled from 'styled-components';
import { loadingState, headerState } from '../atoms';

export default function Img(props) {
  const [loading, setLoading] = useState(true);
  const imgRef = useRef();
  const onLoad = () => {
    //   // alert();
    // setLoading(false);
    // console.log('load');
  };
  useEffect(() => {
    setLoading(true);
    console.log('useEffect');
  }, []);

  useEffect(() => {
    if (imgRef.current) setLoading(false);
    console.log('img');
  }, [imgRef.current]);
  return (
    <span className={styled.img_wrap}>
      {loading ? <span className={styled.loading}>로딩중</span> : null}
      {!props.isapiresponse ? (
        <img
          ref={imgRef}
          {...props}
          onLoad={onLoad}
          src={`${process.env.REACT_APP_IMG_URL}${props.src}`}
          alt={props.alt}
        />
      ) : (
        <img ref={imgRef} {...props} alt={props.alt} />
      )}
    </span>
  );
}
