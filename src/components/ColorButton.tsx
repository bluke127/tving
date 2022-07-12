import React, { useEffect } from 'react';
import { ColorButtonStyle } from 'styled/style';
// import styled from 'styled/style';

export default function ColorButton({
  color,
  onClick,
  backgroundColor,
  text,
  num,
}) {
  return (
    <ColorButtonStyle
      color={color}
      onClick={onClick}
      backgroundColor={backgroundColor}
      num={num}
    >
      {text}
    </ColorButtonStyle>
  );
}
