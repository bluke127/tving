import React from 'react';
import styled from 'styled-components';

const SetStyledCircle = styled.input`
  width: ${props => props.width};
  height: ${props => props.width};
  border-radius: ${props => props.borderRadius};
  background-color: ${props => props.backgroundColor};
`;
const Circle = props => {
  return <SetStyledCircle {...props}></SetStyledCircle>;
};
export default Circle;
