import React from 'react';
import Stone from 'components/Stone';
import styled from 'styled/Omok.module.css';

export default function Omok() {
  return (
    <div className={styled.omok_wrap}>
      <Stone classN={styled.omok} stone="0"></Stone>
    </div>
  );
}
