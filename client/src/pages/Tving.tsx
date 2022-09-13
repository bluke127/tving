import React, {
  Component,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled/Tving.module.css';
import { Element, animateScroll } from 'react-scroll';
import {
  modalFlagState,
  offsetState,
  userIdState,
  loadingState,
  headerState,
  modalDataState,
} from '../atoms';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import { getTopMovie } from 'services/movie';
import { getTopTv } from 'services/tv';
import { getSearchMedia } from 'services/search';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Carousel from 'components/Carousel';
import Search from 'components/Search';

import Modal from 'components/Modal';
import Img from 'components/Img';
import { useOutletContext } from 'react-router-dom';
import { unknownObj, AxiosResponse } from 'types/index';
export default function Tving() {
  const locatedView = useOutletContext();
  useEffect(() => {
    //TODO:
  }, [locatedView]);
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    background-color: blue !important;
  `;
  const scroll = animateScroll;

  const [modalFlag, setModalFlagState] = useRecoilState(modalFlagState);
  const [offset, setOffset] = useRecoilState(offsetState);
  let [color, setColor] = useState('#ffffff');
  //movie리스트와 tv리스트를 담아줄 useState
  const [topMovieList, setTopMovieList] = useState<unknownObj[] | null[]>([]);
  const [topTvList, setTopTvList] = useState<unknownObj[] | null[]>([]);
  const [searchType, setSearchType] = useState<string>('movie');
  const [movieOffset, setMovieOffset] = useState<number>(0);
  const [tvOffset, setTvOffset] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [loading, setLoading] = useRecoilState(loadingState);
  const movieWrap = useRef(null);
  const tvWrap = useRef(null);
  const [wrapArrayIndex, setWrapArrayIndex] = useState<number>(0);
  const h: { current: HTMLElement } | null = useRecoilValue(headerState);
  const a = useRecoilValue(userIdState);
  const header = useMemo<{ current: null | HTMLElement }>(() => {
    return h ? { current: h } : { current: null };
  }, [h]);
  const handleScroll = (event: KeyboardEvent) => {
    event.preventDefault();
    setIndex(event.key, wrapArrayIndex);
    setPageOffset(window.scrollY);
  };
  useEffect(() => {
    setWrapArrayIndex(wrapArrayIndex);
    if (tvWrap.current && movieWrap.current) {
      window.addEventListener('keyup', handleScroll);
    }

    return () => window.removeEventListener('keyup', handleScroll);
  }, [wrapArrayIndex]);

  //상단 header와 movieList의 area, tvList의 area (ref)
  const wrapArray = useMemo(() => {
    setTvOffset((tvWrap.current! as HTMLElement)?.offsetTop);
    return [header, movieWrap, tvWrap];
  }, [header, movieWrap, tvWrap]);
  useEffect(() => {
    console.log(wrapArray);
    setOffset({
      ...offset,
      movie: (wrapArray[1]!.current! as HTMLElement)?.offsetTop,
      tv: (wrapArray[2]!.current! as HTMLElement)?.offsetTop,
    });
  }, [wrapArray]);
  const [areaName, setAreaName] = useState('header');
  useEffect(() => {
    let v;
    if (
      (scrollY >= 0 &&
        scrollY < (header!.current as HTMLElement)?.clientHeight) ||
      !scrollY
    ) {
      v = 'header';
    } else if (
      scrollY >= (header!.current as HTMLElement)?.clientHeight &&
      scrollY < movieOffset
    ) {
      v = 'movie';
    } else if (scrollY >= movieOffset) {
      v = 'tv';
    }
    setAreaName(v as string);
  }, [scrollY]);
  const setIndex = useCallback(
    (type: string, index: number, isHeaderE?: string) => {
      let i = index;
      placedArea.move = false;

      if (isHeaderE) {
        setWrapArrayIndex(index);
        return scroll.scrollTo(
          (wrapArray[i]!.current! as HTMLElement)?.offsetTop,
          {
            top: (wrapArray[i]!.current! as HTMLElement)?.offsetTop,
            duration: 1000,
          }
        );
      }
      if (type === 'ArrowUp') {
        if (i === 0) {
          setWrapArrayIndex(0);
          return scroll.scrollTo(0, {
            top: 0,
            duration: 300,
          });
        }
        i - 1 <= 0 ? (i = 0) : (i = i - 1);
        scroll.scrollTo((wrapArray[i]!.current! as HTMLElement)?.offsetTop, {
          top: (wrapArray[i]!.current! as HTMLElement)?.offsetTop,
          duration: 1000,
        });
        setScrollY((wrapArray[i]!.current! as HTMLElement)?.offsetTop);
        return setWrapArrayIndex(i);
      } else if (type === 'ArrowDown') {
        i + 1 <= wrapArray.length ? (i = i + 1) : (i = i);
        scroll.scrollTo((wrapArray[i]!.current! as HTMLElement)?.offsetTop, {
          top: (wrapArray[i]!.current! as HTMLElement)?.offsetTop,
          duration: 1000,
        });
        setScrollY((wrapArray[i]!.current! as HTMLElement)?.offsetTop);
        return setWrapArrayIndex(i);
      }
    },
    [wrapArrayIndex]
  );
  const [placedArea, setPlacedArea] = useState({
    position: 0,
    areaName: 'header',
    move: false,
  });
  const [pageOffset, setPageOffset] = useState(0);
  const fetchList = useCallback(async () => {
    window.scrollTo({ top: 0 });
    try {
      setLoading(true);
      const [responseMovieList, responseTvList] = await Promise.all([
        getTopMovie(),
        getTopTv(),
      ]);
      responseTvList.results.length > 0
        ? setTopTvList(
            responseTvList.results.map((e: unknownObj) => {
              e.complete = false;
              return e;
            })
          )
        : setTopTvList([null]);
      responseMovieList.results.length > 0
        ? setTopMovieList(
            responseMovieList.results.map((e: unknownObj) => {
              e.complete = false;
              return e;
            })
          )
        : setTopMovieList([null]);
    } catch (e) {
      console.log(e);
    } finally {
      if (wrapArrayIndex == null) setWrapArrayIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const setList = async () => {
      await fetchList();
      window.scrollTo({
        top: offset[offset.selectedOffset as string] as number,
      });
    };
    setList();
  }, []);
  useEffect(() => {
    completeImgLoaded();
  }, [topTvList, topMovieList]);
  const [slideMoveList, slideSetMovieList] = useState([]);
  const [slideTvList, slideSetTvList] = useState([]);
  const [modalData, setModalData] = useRecoilState(modalDataState);
  useEffect(() => {
    console.log(tvWrap, movieWrap, 200);

    // setWrapArrayIndex(wrapArrayIndex);
    // if (tvWrap.current && movieWrap.current) {
    //   window.addEventListener('keyup', handleScroll);
    // }
    // return () => window.removeEventListener('keyup', handleScroll);
  }, [tvWrap.current, movieWrap.current]);

  useEffect(() => {
    if (movieWrap && movieWrap.current) {
      (movieWrap.current as HTMLElement).style.height =
        window.screen.availHeight + 'px';

      setMovieOffset((movieWrap.current! as HTMLElement)?.offsetTop);
    }
  }, [movieWrap.current]);

  useEffect(() => {
    if (tvWrap && tvWrap.current) {
      setTvOffset((tvWrap.current! as HTMLElement)?.offsetTop);
      (tvWrap.current as HTMLElement).style.height =
        window.screen.availHeight + 'px';
    }
  }, [tvWrap.current]);
  useEffect(() => {
    let i = 0;
    if (offset.selectedOffset === 'movie') {
      i = 1;
    } else if (offset.selectedOffset === 'tv') {
      i = 2;
    }
    setIndex(offset.selectedOffset, i as number, 'headerEvent');
    setAreaName(offset.selectedOffset);
  }, [offset.selectedOffset]);
  const [warnMsg, setWarnMsg] = useState<string | null>('');

  const getModalData = useMemo(() => {
    return {
      ...modalData,
      button: [
        {
          text: '확인',
          backgroundColor: 'blue',
          color: '#fff',
          func: () => setModalFlagState(false),
        },
      ],
      warnMsg: warnMsg,
    };
  }, [warnMsg]);
  useEffect(() => {
    setModalData(getModalData);
  }, [getModalData]);
  const searchEvent = useCallback(
    async (e: KeyboardEvent) => {
      let areaN = areaName;

      setOffset({ ...offset, selectedOffset: areaN });
      if (areaName === 'header') {
        areaN = 'movie';
      }

      if (e.key === 'Enter') {
        try {
          console.log(wrapArray + 'enter');
          setLoading(true);
          const res = await getSearchMedia(
            areaN,
            (e.target as HTMLInputElement).value
          );
          if (!res.results.length) {
            setWarnMsg('검색결과가 없다');
            setLoading(false);
            return setModalFlagState(true);
          }
          if (areaN === 'tv') {
            res.results.length > 0
              ? setTopTvList(
                  res.results.map((e: unknownObj) => {
                    e.complete = false;
                    return e;
                  })
                )
              : setTopTvList([null]);
          } else if (areaN === 'movie') {
            res.results.length > 0
              ? setTopMovieList(
                  res.results.map((e: unknownObj) => {
                    e.complete = false;
                    return e;
                  })
                )
              : setTopMovieList([null]);
          }
          setLoading(false);
          console.log(placedArea.position);
        } catch (e) {
          setLoading(false);
          console.log(e);
        }
      }
    },
    [tvWrap.current, movieWrap.current, areaName]
  );
  useEffect(() => {
    // if (localStorage.getItem('offset')) {
    //   window.scrollTo({
    //     top: pageOffset,
    //   });
    // }
  }, [loading]);

  useEffect(() => {
    console.log(movieOffset, tvOffset, '스파이더');
  }, [movieOffset, tvOffset]);
  // const computedMovieImgLoaded = useMemo(() => {
  //   return topMovieList.map((e:unknownObj)=> e.complete === true);
  // }, [topMovieList.map((e:unknownObj)=> e.complete)]);

  // const computedTvImgLoaded = useMemo(() => {
  //   return topTvList.map((e:unknownObj)=> e.complete === true);
  // }, [topTvList]);
  const completeImgLoaded = () => {
    //   console.log(
    //     topMovieList.every(e => e.complete),
    //     topTvList.every(e => e.complete),
    //     computedMovieImgLoaded,
    //     computedTvImgLoaded,
    //     '컨솔'
    //   );
    if (
      topMovieList.length > 0 &&
      topMovieList[0] !== null &&
      topTvList.length > 0 &&
      topTvList[0] !== null &&
      (topMovieList as unknownObj[]).every(e => e.complete) &&
      (topTvList as unknownObj[]).every(e => e.complete)
    ) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  };
  const handleComplete = (list: unknownObj[], i: number, t: string) => {
    if (list[0] !== null) {
      list[i].complete = true;
      completeImgLoaded();
    }
    // completeImgLoaded();
  };

  return (
    <div className={styled.content_wrap}>
      <div style={{ width: '100px', height: '50px', position: 'fixed' }}>
        {/* {topTvList.every(e => e.complete) + 'tv'} */}
        {areaName + '에러이알 넴임'}
        {JSON.stringify(offset) + '지'}
        {wrapArrayIndex + '인텍스'}
        {/* {topMovieList.every(e => e.complete) + 'movie'} */}
      </div>

      <div>
        <Search searchType={searchType} searchEvent={searchEvent}></Search>
        <Element name="movieWrap">
          <div ref={movieWrap} className={styled.content}>
            <Carousel
              setLoading={setLoading}
              setList={slideSetMovieList}
              list={topMovieList[0] !== null ? topMovieList.slice(0, 5) : []}
            ></Carousel>
            <div className={styled.post_wrap}>
              <ul>
                {topMovieList.length > 0 && topMovieList[0] !== null
                  ? topMovieList
                      .slice(0, Math.abs(topMovieList.length / 2))
                      .map((e, i) => (
                        <li
                          className={
                            e!.backdrop_path ? styled.post : styled.empty_img
                          }
                          key={i}
                        >
                          <Link to={`/main/movie/${e!.id}`}>
                            <Img
                              src={e!.backdrop_path}
                              onLoad={() =>
                                handleComplete(
                                  topMovieList as unknownObj[],
                                  i,
                                  'load'
                                )
                              }
                              onError={() => {
                                handleComplete(
                                  topMovieList as unknownObj[],
                                  i,
                                  'load'
                                );
                              }}
                              // onError={handleComplete(topMovieList, i)}
                            />
                          </Link>
                        </li>
                      ))
                  : null}
              </ul>
              <ul>
                {topMovieList.length > 0 && topMovieList[0] !== null
                  ? topMovieList
                      .slice(Math.abs(topMovieList.length / 2))
                      .map((e, i) => (
                        <li
                          className={
                            e!.backdrop_path ? styled.post : styled.empty_img
                          }
                          key={i}
                        >
                          <Link to={`/main/movie/${e!.id}`}>
                            <Img
                              src={e!.backdrop_path}
                              onLoad={() =>
                                handleComplete(
                                  topMovieList as unknownObj[],
                                  i + Math.abs(topMovieList.length / 2),
                                  'load'
                                )
                              }
                              onError={() =>
                                handleComplete(
                                  topMovieList as unknownObj[],
                                  i + Math.abs(topMovieList.length / 2),
                                  'load'
                                )
                              }
                              // onError={handleComplete(
                              //   topMovieList,
                              //   i + Math.abs(topMovieList.length / 2)
                              // )}
                            />
                          </Link>
                        </li>
                      ))
                  : null}
              </ul>
            </div>
          </div>
        </Element>
        <Element name="tvWrap">
          <div ref={tvWrap} className={styled.content}>
            <Carousel
              setLoading={setLoading}
              setList={slideSetTvList}
              list={topTvList[0] !== null ? topTvList.slice(0, 5) : []}
            ></Carousel>
            <div className={styled.post_wrap}>
              <ul>
                {topTvList.length > 0 && topTvList[0] !== null
                  ? topTvList
                      .slice(0, Math.abs(topTvList.length / 2))
                      .map((e, i) => (
                        <li
                          className={
                            e!.backdrop_path ? styled.post : styled.empty_img
                          }
                          key={i}
                        >
                          <Link to={`/main/tv/${e!.id}`}>
                            <Img
                              src={e!.backdrop_path}
                              onLoad={() =>
                                handleComplete(
                                  topTvList as unknownObj[],
                                  i,
                                  'load'
                                )
                              }
                              onError={() =>
                                handleComplete(
                                  topTvList as unknownObj[],
                                  i,
                                  'load'
                                )
                              }
                              // onError={handleComplete(topTvList, i)}
                            />
                          </Link>
                        </li>
                      ))
                  : null}
              </ul>
              <ul>
                {topTvList.length > 0 && topTvList[0] !== null
                  ? topTvList
                      .slice(Math.abs(topTvList.length / 2))
                      .map((e, i) => (
                        <li
                          className={
                            e!.backdrop_path ? styled.post : styled.empty_img
                          }
                          key={i}
                        >
                          <Link to={`/main/tv/${e!.id}`}>
                            <Img
                              src={e!.backdrop_path}
                              onLoad={() =>
                                handleComplete(
                                  topTvList as unknownObj[],
                                  i + Math.abs(topTvList.length / 2),
                                  'load'
                                )
                              }
                              onError={() =>
                                handleComplete(
                                  topTvList as unknownObj[],
                                  i + Math.abs(topTvList.length / 2),
                                  'load'
                                )
                              }
                              // onError={handleComplete(
                              //   topTvList,
                              //   i + Math.abs(topTvList.length / 2)
                              // )}
                            />
                          </Link>
                        </li>
                      ))
                  : null}
              </ul>
            </div>
          </div>
        </Element>
      </div>
    </div>
  );
}
