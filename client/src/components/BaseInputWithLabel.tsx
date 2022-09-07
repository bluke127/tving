import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  StyleHTMLAttributes,
} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from 'styled/Login.module.css';
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

export default function BaseInputWithLable({
  value,
  inputClick,
  onInsert,
  currentTarget,
  setEmpty,
  type = 'text',
  currentTargetRef,
  style,
  beforelabel,
}: {
  value: string;
  inputClick?: Function;
  onInsert?: Function;
  currentTarget?: Object;
  setEmpty?: Function;
  type?: string;
  reg?: RegExp;
  currentTargetRef?: HTMLElement | undefined | null;
  style?: {
    BaseInput: { input: React.CSSProperties; label: React.CSSProperties };
    button: React.CSSProperties;
  };
  beforelabel?: string;
}) {
  // const [currentTarget, setCurrentTarget] =
  //   useRecoilState<any>(currentTargetState);
  // const [userId, setUserId] = useRecoilState(userIdState);
  // const inputClick = (e: React.MouseEvent) => {
  //   setCurrentTarget(e.currentTarget as HTMLInputElement);
  // };
  const idReg: RegExp = /^[a-z]+[a-z0-9]{5,19}$/g;
  const passwordReg: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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

  return (
    <>
      <BaseInput
        type={type}
        value={value}
        onClick={inputClick}
        onChange={insertId}
        ref={currentTargetId}
        style={style!.BaseInput}
        beforelabel={beforelabel}
      />
      {currentTarget === currentTargetId.current && currentTarget ? (
        <button style={style!.button} onClick={() => setId('')}>
          x
        </button>
      ) : null}
    </>
  );
}
