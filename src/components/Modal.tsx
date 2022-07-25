import React, { useEffect, useState, useMemo } from 'react';
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
import Portal from 'utill/Portal';
import { useNavigate } from 'react-router';
type ModalProps = {
  message?: string | null;
  warnMsg: string | null;
  children?: string | null;
  button: buttonType[];
};
type buttonType = {
  color: string | null;
  backgroundColor: string | null;
  func?: Function | null;
  text: string | null;
};
export default function Modal({
  message,
  warnMsg,
  children,
  button,
}: ModalProps) {
  const [modalMsg, setModalMsg] = useState(null);
  useEffect(() => {
    warnMsg ? setModalMsg(warnMsg) : setModalMsg(message);
  }, [warnMsg]);
  const [modalFlag, setModalFlagState] = useRecoilState(modalFlagState);

  const closeModal = () => {
    setModalFlagState(false);
  };
  return (
    <Portal>
      {modalFlag ? (
        <div className={styled.modal_wrap} onClick={closeModal}>
          <div className={styled.modal}>
            {children ? <div>{children}</div> : <div>{modalMsg}</div>}
            <div className={styled.btn_wrap}>
              {button.map((buttonItem: buttonType, index: number) => {
                return (
                  <ColorButton
                    key={index}
                    color={buttonItem.color}
                    backgroundColor={buttonItem.backgroundColor}
                    onClick={() => {
                      return buttonItem.func ? button.func : null;
                    }}
                  >
                    {buttonItem.text}
                  </ColorButton>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </Portal>
  );
}
