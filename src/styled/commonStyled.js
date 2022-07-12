import React from 'react';
import styled, { css } from 'styled-components';

const FlexCenterItem = styled.div`
  display: flex;
  justify-content: center;
`;
const DivInFlexCenterItem = ({ children }) => {
  return <FlexCenterItem>{children}</FlexCenterItem>;
};
export default DivInFlexCenterItem;
