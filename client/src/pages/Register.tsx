import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '../atoms';
import { loginUser } from '_actions/user_action';
import { useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import BaseInputWithCancel from 'components/BaseInputWithCancel';
export default function Register() {
  const location = useNavigate();
  const context: { locateView: Function } = useOutletContext();
  const [modalFlag, setModalFlagState] =
    useRecoilState<boolean>(modalFlagState);
  const dispatch = useDispatch();
  const [currentTarget, setCurrentTarget] =
    useRecoilState<any>(currentTargetState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const inputClick = (e: React.MouseEvent) => {
    setCurrentTarget(e.currentTarget as HTMLInputElement);
  };
  const showModal = (msg?: string) => {
    if (!id && !password) {
      setWarnMsg(`아이디를 입력해주세요!`);
    } else if (msg) {
      setWarnMsg(msg);
    }
    setModalFlagState(true);
  };
  const idReg: RegExp = /^[a-z]+[a-z0-9]{5,19}$/g;
  const passwordReg: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  type warnMsgType = {
    string: string;
    value: string;
    reg: boolean;
  };
  type warnMsgPasswordConfirmType = Pick<warnMsgType, 'value' | 'string'> & {
    accordPassword: boolean;
  };
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');

  const [loginFlag, setLoginFlag] = useRecoilState(loginFlagState);
  const currentTargetId = useRef<HTMLInputElement>(null);
  const currentTargetPassword = useRef<HTMLInputElement>(null);
  const currentTargetPasswordConfirm = useRef<HTMLInputElement>(null);
  const currentTargetEmail = useRef<HTMLInputElement>(null);
  const currentTargetName = useRef<HTMLInputElement>(null);
  const [warnMsgConfig, setWarnMsgConfig] = useState<{
    id: warnMsgType;
    password: warnMsgType;

    passwordConfirm: warnMsgPasswordConfirmType;
    email: warnMsgType;
    name: warnMsgType;
  }>({
    id: { string: '아이디', value: id, reg: true },
    password: { string: '비밀번호', value: password, reg: true },
    passwordConfirm: {
      string: '비밀번호 확인해주소',
      value: passwordConfirm,
      accordPassword: useMemo(
        () => password === passwordConfirm,
        [password]
      ) as boolean,
    },
    email: { string: '이메일', value: id, reg: true },
    name: { string: '이름', value: name, reg: true },
  });
  const [warnMsg, setWarnMsg] = useState<string | null>(null);
  const baseInputStyle = {
    BaseInput: {
      input: { backgroundColor: 'lightcoral' },
      label: { color: 'blue' },
    },
    button: { fontSize: '25px' },
  };
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
  const insertPasswordConfirm = (e: React.ChangeEvent) => {
    let value =
      typeof e === 'object' ? (e.target as HTMLInputElement).value : e;
    setPasswordConfirm(value);
  };
  const insertEmail = (e: React.ChangeEvent) => {
    let value =
      typeof e === 'object' ? (e.target as HTMLInputElement).value : e;
    setEmail(value);
  };

  const insertName = (e: React.ChangeEvent) => {
    let value =
      typeof e === 'object' ? (e.target as HTMLInputElement).value : e;
    setName(value);
  };
  useEffect(() => {
    console.log(context.locateView);

    if (loginFlag) {
      context.locateView();
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

  const checkPasswordConfirm = useMemo(() => {
    setWarnMsgConfig({
      ...warnMsgConfig,
      passwordConfirm: {
        ...warnMsgConfig.passwordConfirm,
        value: passwordConfirm,
        accordPassword: password === passwordConfirm,
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
      } else if (
        Object.keys(objValue).includes('reg')
          ? !(objValue as warnMsgType).reg
          : !(objValue as warnMsgPasswordConfirmType).accordPassword
      ) {
        Object.keys(objValue).includes('reg')
          ? setWarnMsg(`${objValue.string} 형식이 올바르지 않습니다.`)
          : setWarnMsg(`${objValue.string}`);
        return;
      }
      setWarnMsg('');
    }
  }, [id, password]);

  useEffect(() => {
    setWarnMsg(null);
  }, []);
  const login = async () => {
    if (!id && !password) {
      setWarnMsg('아이디을 입력해주세요!');
    }
    try {
      const response: {
        [key: string]: any;
      } = await dispatch(loginUser({ user_id: id, password }));
      console.log(response, 'response');
      if (!response.payload.loginSuccess) {
        showModal(response.payload.message);
      } else {
        sessionStorage.setItem('userInfo', id);
        setLoginFlag(true);
        context.locateView();
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Modal
        warnMsg={warnMsg}
        button={[
          {
            text: '확인',
            backgroundColor: 'blue',
            color: '#fff',
          },
          { text: '취소', backgroundColor: 'lightGray', color: '#000' },
        ]}
      ></Modal>
      <div className={styles.wrap}>
        <div className={styles.input_wrap}>
          <BaseInputWithCancel
            value={id}
            inputClick={inputClick}
            onInsert={insertId}
            currentTarget={currentTarget}
            currentTargetRef={currentTargetId?.current}
            setEmpty={() => setId('')}
            style={baseInputStyle}
            beforelabel={'id'}
          ></BaseInputWithCancel>
          <BaseInputWithCancel
            value={password}
            inputClick={inputClick}
            onInsert={insertPassword}
            currentTarget={currentTarget}
            currentTargetRef={currentTargetPassword?.current}
            setEmpty={() => setPassword('')}
            style={baseInputStyle}
            beforelabel={'password'}
          ></BaseInputWithCancel>

          <BaseInputWithCancel
            value={passwordConfirm}
            inputClick={inputClick}
            onInsert={insertPasswordConfirm}
            currentTarget={currentTarget}
            currentTargetRef={currentTargetPasswordConfirm?.current}
            setEmpty={() => setPasswordConfirm('')}
            style={baseInputStyle}
            beforelabel={'passwordConfirm'}
          ></BaseInputWithCancel>

          <BaseInputWithCancel
            value={email}
            inputClick={inputClick}
            onInsert={insertEmail}
            currentTarget={currentTarget}
            currentTargetRef={currentTargetEmail?.current}
            setEmpty={() => setEmail('')}
            style={baseInputStyle}
            beforelabel={'email'}
          ></BaseInputWithCancel>

          <BaseInputWithCancel
            value={name}
            inputClick={inputClick}
            onInsert={insertName}
            currentTarget={currentTarget}
            currentTargetRef={currentTargetName?.current}
            setEmpty={() => setName('')}
            style={baseInputStyle}
            beforelabel={'name'}
          ></BaseInputWithCancel>
          <div>{warnMsg}</div>
          <ColorButton
            onClick={() =>
              warnMsg || id === '' || password === '' ? showModal() : login()
            }
            backgroundColor={'red'}
            color={'yellow'}
          >
            로그인
          </ColorButton>
        </div>
      </div>
    </>
  );
}
