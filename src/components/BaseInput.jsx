import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled/Modal.module.css';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

export default function BaseInput(props) {
  return (
    <>
      <input {...props} />
      {props.label ? <label htmlFor={props.id}></label> : null}
    </>
  );
}
