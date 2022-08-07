import React, { useEffect } from 'react';
import { ColorButtonStyle } from 'styled/style';

export default function ColorButton(props: any) {
  return <ColorButtonStyle {...props}>{props.children}</ColorButtonStyle>;
}
