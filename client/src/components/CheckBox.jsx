import React, { useEffect } from 'react';
import { CheckBoxStyle } from 'styled/style';

export default function CheckBox(props) {
  return <CheckBoxStyle {...props} type="checkbox"></CheckBoxStyle>;
}
