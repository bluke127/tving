import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
export const rowState = atom({
  key: 'row',
  default: 25,
});

export const columnState = atom({
  key: 'column',
  default: 25,
});
export const modalFlagState = atom({
  key: 'modalFlag',
  default: false,
});
