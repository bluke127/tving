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
import styled from 'styled/Img.module.css';
import { loadingState, headerState } from '../atoms';
export default function Img(props: any) {
  const [loading, setLoading] = useRecoilState(loadingState);
  const imgRef = useRef();
  useEffect(() => {
    // if (imgRef.current) setLoading(false);
    console.log('img');
  }, [imgRef.current]);

  useEffect(() => {
    setLoading(true);
  }, []);
  return (
    <span className={styled.img_wrap}>
      {!props.isapiresponse ? (
        <img
          ref={imgRef}
          {...props}
          src={`${process.env.REACT_APP_IMG_URL}${props.src}`}
          alt={props.alt}
        />
      ) : (
        <img ref={imgRef} {...props} alt={props.alt} />
      )}
    </span>
  );
}
