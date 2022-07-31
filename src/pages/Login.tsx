import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLogin } from 'services/account';
import Modal from 'components/Modal';
import styles from 'styled/Login.module.css';
import ColorButton from 'components/ColorButton';
import { useRecoilState } from 'recoil';
import { modalFlagState, userIdState, currentTargetState } from '../atoms';

export default function Login() {
  const location = useNavigate();
  const [modalFlag, setModalFlagState] =
    useRecoilState<boolean>(modalFlagState);

  const [currentTarget, setCurrentTarget] =
    useRecoilState<any>(currentTargetState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const inputClick = (e: React.MouseEvent) => {
    setCurrentTarget(e.currentTarget as HTMLInputElement);
  };
  const showModal = () => {
    if (!id && !password) {
      setWarnMsg(`아이디를 입력해주세요!`);
    }
    setModalFlagState(true);
  };
  const idReg: RegExp = /^[a-z]+[a-z0-9]{5,19}$/g;
  const passwordReg: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  useEffect(() => {
    console.log(password);
  }, [password]);
  const currentTargetId = useRef<HTMLInputElement>(null);
  const currentTargetPassword = useRef<HTMLInputElement>(null);

  let [warnMsgConfig, setWarnMsgConfig] = useState<{
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

  // const checkId = useMemo(() => {
  //   setWarnMsgConfig({
  //     ...warnMsgConfig,
  //     id: { ...warnMsgConfig.id, value: id, reg: idReg.test(id) },
  //   });
  // }, [id]);
  // const checkPassword = useMemo(() => {
  //   setWarnMsgConfig({
  //     ...warnMsgConfig,
  //     password: {
  //       ...warnMsgConfig.password,
  //       value: password,
  //       reg: passwordReg.test(password),
  //     },
  //   });
  // }, [password]);
  useEffect(() => {
    const obj = Object.entries(warnMsgConfig);
    for (let i = 0; i < obj.length; i++) {
      let [key, objValue] = obj[i];
      console.log(warnMsgConfig, obj);
      if (!objValue.value) {
        setWarnMsg(`${objValue.string}을 입력해주세요!`);
        return;
      } else if (!objValue.reg) {
        console.log(objValue.value, idReg, id, '>>');
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
    const response = await getLogin();
    console.log(response);

    location('/main/tving');
    sessionStorage.setItem('userInfo', id);
  };
  // const counterHandler = useSetRecoilState(countState); // 값만 변경 시키기
  // const resetCounter = useResetRecoilState(countState); // 디폴트값으로 값 변경

  // const [counter, setCoounter] = useRecoilState(countState);
  // const currentCount = useRecoilValue(countState); // 읽기 전용!
  // const counterHandler = useSetRecoilState(countState); // 값만 변경 시키기
  // const resetCounter = useResetRecoilState(countState); // 디폴트값으로 값 변경
  // const plusCount = () => {
  //   counterHandler(pre => pre + 1);
  // };
  // const minusCount = () => {
  //   counterHandler(pre => pre - 1);
  // };
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
            <input
              type="text"
              value={id}
              onClick={inputClick}
              onChange={insertId}
              ref={currentTargetId}
            />
            {currentTarget === currentTargetId.current ? (
              <button onClick={() => setId('')}>x</button>
            ) : null}
          </div>
          <div>
            <input
              type="text"
              value={password}
              onClick={inputClick}
              onChange={insertPassword}
              ref={currentTargetPassword}
            />
            {currentTarget === currentTargetPassword.current ? (
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
