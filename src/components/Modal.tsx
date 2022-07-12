import React, { useEffect, useState } from 'react';
import styled from 'styled/Modal.module.css';
import ColorButton from './ColorButton';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { modalFlagState } from '../atoms';

import { useNavigate } from 'react-router';
export default function Modal({ stone, children, classN, msg, warnMsg }) {
  const location = useNavigate();

  const [modalFlag, setModalFlagState] = useRecoilState(modalFlagState);
  const onPage = param => {
    location('/tving');
  };
  const closeModal = () => {
    setModalFlagState(false);
  };
  return (
    <>
      {modalFlag ? (
        <div className={styled.modal_wrap} onClick={closeModal}>
          <div className={styled.modal}>
            <div>{children}</div>
            <div className={styled.warn_msg}>{warnMsg}</div>
            <div className={styled.btn_wrap}>
              <ColorButton
                color="#fff"
                backgroundColor={'#00f'}
                num="2"
                text="확인123"
                onClick={onPage}
              />
              <ColorButton
                color="#000"
                backgroundColor="#fff"
                num="2"
                text="취소"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
