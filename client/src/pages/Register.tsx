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
import BaseInputWithLabel from 'components/BaseInputWithLabel';
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
  const [warnMsg, setWarnMsg] = useState<string | null>(null);
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
          <BaseInputWithLabel
            value={id}
            inputClick={inputClick}
            onInsert={insertId}
            currentTarget={currentTarget}
            currentTargetRef={currentTargetId?.current}
            setEmpty={() => setId('')}
            style={{
              BaseInput: {
                input: { backgroundColor: 'lightcoral' },
                label: { color: 'blue' },
              },
              button: { fontSize: '25px' },
            }}
            beforelabel={'id'}
          ></BaseInputWithLabel>
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
