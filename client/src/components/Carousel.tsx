import React, { useEffect, useState, useMemo, forwardRef, useRef } from 'react';
import styled from 'styled/Carousel.module.css';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Img from 'components/Img';
import { unknownObj } from 'types';
export default function Carousel({
  list,
  width = '500px',
  height = '300px',
  setList,
  setLoading,
}: {
  list: any;
  width?: any;
  height?: any;
  setList?: any;
  setLoading?: any;
}) {
  const screen = useRef(null);
  const film = useRef<HTMLUListElement>(null);
  const scene = useRef([]);
  const addScene = (el: any) => {
    if (el) (scene.current as any[]).push(el);
  };
  const prev = () => {
    (film.current as HTMLElement).style.transition = 'all 0.5s ease';
    let indexV;

    if (((-1 * 100) / list.length) * (index - 1) >= 10) {
      indexV = index;
    } else {
      indexV = index - 1;
    }

    (film.current as HTMLElement).style.transform = `translateX(${
      ((-1 * 100) / list.length) * indexV
    }%)`;
    setIndex(indexV);
  };
  const next = () => {
    (film.current as HTMLElement).style.transition = 'all 0.5s ease';
    let indexV;
    if (((-1 * 100) / list.length) * (index + 1) <= -95) {
      indexV = index;
    } else {
      indexV = index + 1;
    }

    (film.current as HTMLElement).style.transform = `translateX(${
      ((-1 * 100) / list.length) * indexV
    }%)`;
    setIndex(indexV);
  };
  const [index, setIndex] = useState(0);
  const [firstFlag, setFirstFlag] = useState(true);
  useEffect(() => {
    if (firstFlag && list.length) {
      let listV = list;
      const ele = listV.pop();
      listV.unshift(ele);
      setList(listV);
      setFirstFlag(false);

      (film.current as HTMLElement).style.marginLeft = `-${index * 100}%`;
    }
  }, [list]);
  useEffect(() => {
    (film.current as HTMLElement).style.transform = `translateX(${
      ((-1 * 100) / list.length) * index
    }%)`;
  }, [index]);
  const goIndex = (idx: number) => {
    setIndex(idx);
  };
  return (
    <div className={styled.screen} style={{ width, height }} ref={screen}>
      <ul
        className={styled.film}
        ref={film}
        style={{ width: 100 * list.length + '%' }}
      >
        {list.length > 0
          ? list.map((e: any, index: any) => (
              <li
                ref={element => addScene(element)}
                key={e.backdrop_path}
                className={styled.scene}
                style={{ width: (screen.current! as HTMLElement).clientWidth }}
              >
                <Img
                  className={styled.img}
                  src={e.backdrop_path}
                  alt={`list_${index}`}
                />
              </li>
            ))
          : null}
      </ul>
      <div className={styled.btn_wrap}>
        <button className={styled.prev} onClick={prev}>
          이전
        </button>
        <button className={styled.next} onClick={next}>
          다음
        </button>
      </div>
      <ul className={styled.index_wrap}>
        {list.length > 0
          ? list.map((e: unknownObj, index: number) => (
              <li onClick={() => goIndex(index)} key={index}>
                {index}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
