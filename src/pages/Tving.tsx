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
import { loadingState, headerState } from '../atoms';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import { modalFlagState, countState, offsetState, userIdState } from '../atoms';
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
import { unknownObj } from 'types/index';
export default function Tving() {
  const locatedView = useOutletContext();
  useEffect(() => {
    //TODO:
    alert(locatedView + 'TVIE');
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
  // const location = useNavigate();
  // const id = useRecoilValue(userIdState);
  // useEffect(() => {
  //   if (!id) location('/');
  // }, [id]);
  const handleScroll = (event: KeyboardEvent) => {
    event.preventDefault();
    setIndex(event.key, wrapArrayIndex);
    // setScrollY(window.scrollY);
    setPageOffset(window.scrollY);
  };
  // ,
  // [wrapArrayIndex]
  // );
  useEffect(() => {
    setWrapArrayIndex(wrapArrayIndex);
    if (tvWrap.current && movieWrap.current) {
      window.addEventListener('keyup', handleScroll);
    }

    return () => window.removeEventListener('keyup', handleScroll);
  }, [wrapArrayIndex]);

  //상단 header와 movieList의 area, tvList의 area (ref)
  const wrapArray = useMemo(() => {
    console.log(header, movieWrap, tvWrap);
    console.log(
      (tvWrap.current! as HTMLElement)?.offsetTop,
      (movieWrap.current! as HTMLElement)?.offsetTop
    );
    setTvOffset((tvWrap.current! as HTMLElement)?.offsetTop);
    setMovieOffset((movieWrap.current! as HTMLElement)?.offsetTop);
    return [header, movieWrap, tvWrap];
  }, [header, movieWrap, tvWrap]);
  useEffect(() => {
    console.log(wrapArray);
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
    console.log(
      '화이팅',

      (header!.current as HTMLElement)?.offsetTop,
      movieOffset,
      tvOffset,
      v,
      areaName
    );
    setAreaName(v as string);
  }, [scrollY]);
  const setIndex = useCallback(
    (type: string, index: number) => {
      let i = index;
      placedArea.move = false;
      console.log(wrapArray, 'wrapArray');
      alert(wrapArrayIndex + 'index');
      if (type === 'ArrowUp') {
        if (i === 0) {
          setWrapArrayIndex(0);
          alert();
          return scroll.scrollTo(0, {
            top: 0,
            duration: 300,
          });
        }
        i - 1 <= 0 ? (i = 0) : (i = i - 1);
        console.log(wrapArray, header);
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
      console.log(1);
    } catch (e) {
      console.log(e);
    } finally {
      setWrapArrayIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log(topMovieList);
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchList();
  }, []);
  useEffect(() => {
    completeImgLoaded();
  }, [topTvList, topMovieList]);
  const [slideMoveList, slideSetMovieList] = useState([]);
  const [slideTvList, slideSetTvList] = useState([]);
  useEffect(() => {
    // setWrapArrayIndex(wrapArrayIndex);
    // if (tvWrap.current && movieWrap.current) {
    //   window.addEventListener('keyup', handleScroll);
    // }
    // return () => window.removeEventListener('keyup', handleScroll);
  }, [tvWrap.current, movieWrap.current]);

  useEffect(() => {
    if (movieWrap && movieWrap.current) {
      console.log(
        movieWrap.current,
        'movieWrap',
        (movieWrap.current as HTMLElement)?.offsetTop
      );
      alert((movieWrap.current as HTMLElement)?.offsetTop + 'movieWrap');

      // setMovieOffset((movieWrap.current as HTMLElement)?.offsetTop);
      (movieWrap.current as HTMLElement).style.height =
        window.screen.availHeight + 'px';
    }
  }, [movieWrap.current]);

  useEffect(() => {
    if (tvWrap && tvWrap.current) {
      console.log(
        tvWrap.current,
        'tvWrap',
        (tvWrap.current! as HTMLElement)?.offsetTop
      );
      alert((tvWrap.current as HTMLElement)?.offsetTop + 'movieWrap');

      // setTvOffset((tvWrap.current! as HTMLElement).offsetTop));
      (tvWrap.current as HTMLElement).style.height =
        window.screen.availHeight + 'px';
    }
  }, [tvWrap.current]);
  const [warnMsg, setWarnMsg] = useState<string | null>(null);
  const searchEvent = useCallback(
    async (e: KeyboardEvent) => {
      console.log(wrapArray[wrapArrayIndex], wrapArray, wrapArrayIndex);
      let areaN = areaName;
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
          console.log(
            localStorage.getItem('offset') + 'px',
            typeof localStorage.getItem('offset')
          );
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
    if (localStorage.getItem('offset')) {
      window.scrollTo({
        top: pageOffset,
      });
    }
  }, [loading]);

  useEffect(() => {
    alert(JSON.stringify({ movie: movieOffset, tv: tvOffset }));
    setOffset({ movie: movieOffset, tv: tvOffset });
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
      console.log(
        '실행',
        (topMovieList as unknownObj[]).map((e: unknownObj) => e.complete),
        (topTvList as unknownObj[]).map((e: unknownObj) => e.complete),
        (topMovieList as unknownObj[]).every(e => e.complete),
        (topTvList as unknownObj[]).every(e => e.complete)
      );
      list[i].complete = true;
      console.log(list[i]);
      completeImgLoaded();
    }
    // completeImgLoaded();
  };

  return (
    <div className={styled.content_wrap}>
      <div style={{ width: '100px', height: '50px', position: 'fixed' }}>
        {/* {topTvList.every(e => e.complete) + 'tv'} */}
        {areaName + '에러이알 넴임'}
        {/* {topMovieList.every(e => e.complete) + 'movie'} */}
      </div>
      <Modal
        warnMsg={warnMsg}
        button={[
          {
            text: '확인',
            backgroundColor: 'blue',
            color: '#fff',
            func: () => setLoading(false),
          },
        ]}
      ></Modal>

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
                        <li className={styled.post} key={i}>
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
                        <li className={styled.post} key={i}>
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
                        <li className={styled.post} key={i}>
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
                        <li className={styled.post} key={i}>
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
