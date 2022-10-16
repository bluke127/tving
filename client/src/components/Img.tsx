import React, { useEffect, useState, useRef, useMemo, forwardRef } from 'react';

import { LazyLoadImage } from 'react-lazy-load-image-component';
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
  const [innerLoad, setInnerLoad] = useState(false);
  const imgRef = useRef();
  useEffect(() => {
    // if (imgRef.current) setLoading(false);
    if (imgRef.current) {
      setLoading(false);
      setInnerLoad(false);
    }
    console.log('img');
  }, [imgRef.current]);

  useEffect(() => {
    setLoading(true);
    setInnerLoad(true);
  }, []);
  return (
    <span className={styled.img_wrap}>
      {innerLoad ?? '로딩'}
      {!props.isapiresponse ? (
        <LazyLoadImage
          ref={imgRef}
          {...props}
          src={`${process.env.REACT_APP_IMG_URL}${props.src}`}
          alt={props.alt}
        />
      ) : (
        <LazyLoadImage ref={imgRef} {...props} alt={props.alt} />
      )}
    </span>
  );
}
