import React, { Component, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'components/Modal.tsx';
import styles from 'styled/Login.module.css';
import ModuleStyles from 'styled/Modal.module.css';
import DivInFlexItem from 'styled/commonStyled';
import Circle from 'styled/circle';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { rowState, columnState, modalFlagState } from '../atoms';

export default function Start() {
  const [modalFlag, setModalFlagState] = useRecoilState(modalFlagState);
  const showModal = () => {
    setModalFlagState(true);
  };
  let idReg: RegExp = /^[a-z]+[a-z0-9]{5,19}$/g;
  let passwordReg: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string | number>('');
  const [warnMsg, setWarnMsg] = useState(null);
  const insertId = (e, func) => {
    if (idReg.test(e.target.value)) {
      idReg.test(e.target.value);
      func(e.target.value);
    } else {
      setWarnMsg('아이디 형식이 올바르지 않습니다.');
    }
  };
  const insertPass = (e, func) => {
    if (passwordReg.test(e.target.value)) {
      passwordReg.test(e.target.value);
      func(e.target.value);
    } else {
      setWarnMsg('비밀번호 형식이 올바르지 않습니다.');
    }
  };

  return (
    <>
      <div className={styles.wrap} onClick={showModal}>
        오목 드가자
      </div>
      {modalFlag ? (
        <Modal warnMsg={warnMsg}>
          (
          <>
            <div className={styles.text_center}>Row와 Column은?</div>
            <DivInFlexItem>
              <div className={ModuleStyles.twin_input_wrap}>
                <Circle
                  width={'5vw'}
                  maxLength="1"
                  borderRadius={'75px'}
                  onInput={event => insertNumber(event, setRow)}
                  value={row}
                ></Circle>
                x
                <Circle
                  width={'4vw'}
                  maxLength="1"
                  value={column}
                  borderRadius={'75px'}
                  onInput={event => insertNumber(event, setRow)}
                ></Circle>
              </div>
            </DivInFlexItem>
          </>
          )
        </Modal>
      ) : null}
    </>
  );
}
