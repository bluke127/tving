import styled from 'styled-components';

export const BodyBackground = styled.div`
  background-color: ${props => props.background || 'transparent'};
  width: 100%;
  height: 100%;
`;

export const stone = styled.span`
  width: calc(100% / ${({ cutting }) => cutting});
  height: calc(100% / ${({ cutting }) => cutting});
`;
export const AreaSpanForCenter = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  display: inline-block;
`;
export const BaseButton = styled.button`
  width: calc(100% / ${({ num }) => (num ? num : 1)});
  text-align: center;
  line-height: 50px;
  cursor: pointer;
`;

export const ColorButtonStyle = styled(BaseButton)`
  background: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

export const CheckBoxStyle = styled.input`
  background: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;
