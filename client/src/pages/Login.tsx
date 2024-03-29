import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLogin } from 'services/account';
import Modal from 'components/Modal';
import styles from 'styled/Login.module.css';
import ColorButton from 'components/ColorButton';
import BaseInput from 'components/BaseInput';
import { useRecoilState } from 'recoil';
import {
  modalFlagState,
  userIdState,
  currentTargetState,
  loginFlagState,
  userNameState,
  modalDataState,
} from '../atoms';
import { loginUser } from '_actions/user_action';
import { useDispatch } from 'react-redux';
import { createCipheriv } from 'crypto';
import { useOutletContext } from 'react-router-dom';
import UseAsync from 'utill/useAsync';
export default function Login() {
  const location = useNavigate();
  const context: { locateView: Function } = useOutletContext();
  const [modalFlag, setModalFlag] = useRecoilState<boolean>(modalFlagState);
  const dispatch = useDispatch();
  const [currentTarget, setCurrentTarget] =
    useRecoilState<any>(currentTargetState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [name, setName] = useRecoilState(userNameState);
  const inputClick = (e: React.MouseEvent) => {
    setCurrentTarget(e.currentTarget as HTMLInputElement);
  };
  const showModal = (msg?: string) => {
    if (!id && !password) {
      setWarnMsg(`아이디를 입력해주세요!`);
    } else if (msg) {
      setWarnMsg(msg);
    }
    setModalFlag(true);
  };
  const idReg: RegExp = /^[a-z]+[a-z0-9]{5,19}$/g;
  const passwordReg: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginFlag, setLoginFlag] = useRecoilState(loginFlagState);
  const currentTargetId = useRef<HTMLInputElement>(null);
  const currentTargetPassword = useRef<HTMLInputElement>(null);
  const [warnMsgConfig, setWarnMsgConfig] = useState<{
    id: {
      string: string;
      value: string;
      reg: boolean;
    };
    password: {
      string: string;
      value: string;
      reg: boolean;
    };
  }>({
    id: { string: '아이디', value: id, reg: true },
    password: { string: '비밀번호', value: password, reg: true },
  });
  const [warnMsg, setWarnMsg] = useState('');
  const [modalData, setModalData] = useRecoilState(modalDataState);

  const getModalData = useMemo(() => {
    return {
      ...modalData,
      button: [
        {
          text: '확인',
          backgroundColor: 'blue',
          color: '#fff',
          func: () => setModalFlag(false),
        },
      ],
      warnMsg: warnMsg,
    };
  }, [warnMsg]);
  useEffect(() => {
    setModalData(getModalData);
  }, [getModalData]);
  const insertId = (e: React.ChangeEvent) => {
    let value =
      typeof e === 'object' ? (e.target as HTMLInputElement).value : e;
    setId(value);
  };
  const insertPassword = (e: React.ChangeEvent) => {
    let value =
      typeof e === 'object' ? (e.target as HTMLInputElement).value : e;
    setPassword(value);
  };
  useEffect(() => {
    console.log(context.locateView);

    if (loginFlag) {
      context.locateView('/tving');
    }
  }, []);
  const checkId = useMemo(() => {
    setWarnMsgConfig({
      ...warnMsgConfig,
      id: { ...warnMsgConfig.id, value: id, reg: idReg.test(id) },
    });
  }, [id]);
  const checkPassword = useMemo(() => {
    setWarnMsgConfig({
      ...warnMsgConfig,
      password: {
        ...warnMsgConfig.password,
        value: password,
        reg: passwordReg.test(password),
      },
    });
  }, [password]);
  useEffect(() => {
    const obj = Object.entries(warnMsgConfig);
    for (let i = 0; i < obj.length; i++) {
      let [key, objValue] = obj[i];
      if (!objValue.value) {
        setWarnMsg(`${objValue.string}을 입력해주세요!`);
        return;
      } else if (!objValue.reg) {
        setWarnMsg(`${objValue.string} 형식이 올바르지 않습니다.`);
        return;
      }
      setWarnMsg('');
    }
  }, [id, password]);

  useEffect(() => {
    setWarnMsg('');
  }, []);
  // const [excute, setExcute] = useState(false);
  // const response: {
  //   [key: string]: any;
  // } = UseAsync(dispatch(loginUser({ user_id: id, password })), excute);
  // const { execute } = {
  //   execute: () => {
  //     return [];
  //   },
  // };
  const { execute } = UseAsync(
    () => dispatch(loginUser({ user_id: id, password })),
    false
  );

  const login = async () => {
    if (!id && !password) {
      setWarnMsg('아이디을 입력해주세요!');
      return showModal(warnMsg);
    } else if (warnMsg) {
      setWarnMsg(warnMsg);
      return showModal(warnMsg);
    }

    const response = await execute();
    try {
      console.log(response, 'response');
      if (!response.payload.loginSuccess) {
        showModal(response.payload.message);
      } else {
        setName(response.payload.name);
        sessionStorage.setItem('userInfo', response.payload.id);
        setLoginFlag(true);
        context.locateView('/tving');
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {/* <button onClick={() => setCounter((num) => num + 1)}>+</button>
      <button onClick={() => setCounter((num) => num - 1)}>-</button> */}
      {/* <button onClick={plusCount}>+</button>
      <button onClick={minusCount}>-</button>
      <button onClick={resetCounter}>reset</button>
      <button
        onClick={() => {
          location('/tving');
        }}
      >
        tt
      </button> */}
      {/* </> */}
      <div className={styles.wrap}>
        로그인
        <div className={styles.input_wrap}>
          <div>
            <BaseInput
              type="text"
              value={id}
              onClick={inputClick}
              onChange={insertId}
              ref={currentTargetId}
            />
            {currentTarget === currentTargetId.current && currentTarget ? (
              <button onClick={() => setId('')}>x</button>
            ) : null}
          </div>
          <div>
            <BaseInput
              type="text"
              value={password}
              onClick={inputClick}
              onChange={insertPassword}
              ref={currentTargetPassword}
            />
            {currentTarget === currentTargetPassword.current &&
            currentTarget ? (
              <button onClick={() => setPassword('')}>x</button>
            ) : null}
          </div>
          <div>{warnMsg}</div>
          <ColorButton onClick={login} backgroundColor={'red'} color={'yellow'}>
            로그인
          </ColorButton>
        </div>
      </div>
    </>
  );
}
