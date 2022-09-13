import { buttonType } from 'types';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

export const modalFlagState = atom({
  key: 'modalFlag',
  default: false,
});

type ModalProps = {
  message?: string | number | null;
  warnMsg?: string | number | null;
  children?: string | number | null;
  button?: buttonType[];
};
export const modalDataState = atom<ModalProps>({
  key: 'modalData',
  default: {
    message: '',
    warnMsg: '',
    children: null,
    button: [{ color: '', text: '', func: null, backgroundColor: '' }],
  },
});
export const countState = atom({
  key: 'counter',
  default: 0,
});

export const userIdState = atom<string | null>({
  key: 'userId',
  default: null,
});

export const loginFlagState = atom({
  key: 'loginFlag',
  default: false,
});

export const currentTargetState = atom({
  key: 'currentTarget',
  default: null,
});

export const favorateState = atom({
  key: 'favorate',
  default: JSON.parse(JSON.stringify(localStorage.getItem('favorate') ?? [])),
});

//TODO: 수정필요
export const favorateSelector = selector({
  key: 'favorateSelector',

  get: ({ get }) => {
    return get(JSON.parse(JSON.stringify(favorateState)));
  },
  set: ({ set }, newValue: any) => {
    localStorage.setItem('favorate', newValue);
    set(favorateState, newValue); // input atom 수정
  },
});

export const loadingState = atom({
  key: 'loading',
  default: true,
});
export const headerState = atom({
  key: 'header',
  default: null,
});
export const userNameState = atom({
  key: 'userName',
  default: '',
});

export const currentTargetSelector = selector({
  key: 'currentTargetSelector',

  get: ({ get }) => {
    const currentTarget = get(currentTargetState);

    return ` ${currentTarget}.`;
  },
});

export const countStateSelector = selector({
  key: 'CountState2',

  get: ({ get }) => {
    const count = get(countState);

    return ` 현재 카운트는 ${count}입니다.`;
  },
});

export const useInfo = atom({
  key: 'id',
  default: null,
});
export const offsetState = atom<any>({
  key: 'offset',
  default: { movie: 0, tv: 0, selectedOffset: null },
});
