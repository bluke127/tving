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
import { buttonType } from 'types';
import { modalFlagState, modalDataState } from '../atoms';
import Portal from 'utill/Portal';
import { useNavigate } from 'react-router';
type ModalProps = {
  message?: string | number | null;
  warnMsg?: string | number | null;
  children?: string | number | null;
  button?: buttonType[];
};
export default function Modal() {
  // {
  //   message,
  //   warnMsg,
  //   children,
  //   button,
  // }: ModalProps
  const { message, warnMsg, children, button } = useRecoilValue(modalDataState);
  const [modalMsg, setModalMsg] = useState<string | number | null>(null);
  useEffect(() => {
    warnMsg ? setModalMsg(warnMsg) : setModalMsg(message as string);
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
              {button?.map((buttonItem: buttonType, index: number) => {
                return (
                  <ColorButton
                    key={index}
                    color={buttonItem.color}
                    backgroundColor={buttonItem.backgroundColor}
                    onClick={() => {
                      return buttonItem.func ? buttonItem.func() : null;
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
