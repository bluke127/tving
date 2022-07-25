import React, {
  Component,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import styled from 'styled/Tving.module.css';

import { loadingState, headerState } from '../atoms';
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import { modalFlagState, countState, userIdState } from '../atoms';
import { getTopMovie } from 'services/movie';
import { getTopTv } from 'services/tv';
import { getSearchMedia } from 'services/search';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Carousel from 'components/Carousel';
import Search from 'components/Search';

import Modal from 'components/Modal';
import Img from 'components/Img';
export default function Tving(props) {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    background-color: blue !important;
  `;

  const [modalFlag, setModalFlagState] = useRecoilState(modalFlagState);

  let [color, setColor] = useState('#ffffff');
  //movie리스트와 tv리스트를 담아줄 useState
  const [topMovieList, setTopMovieList] = useState([]);
  const [topTvList, setTopTvList] = useState([]);
  const [searchType, setSearchType] = useState('movie');
  const [movieOffset, setMovieOffset] = useState(0);
  const [tvOffset, setTvOffset] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useRecoilState(loadingState);
  const movieWrap = useRef(null);
  const tvWrap = useRef(null);
  const [wrapArrayIndex, setWrapArrayIndex] = useState(0);
  const header = useRecoilValue(headerState);
  const handleScroll =
    // useCallback(
    event => {
      setIndex(event.key, wrapArrayIndex);
      setScrollY(window.scrollY);
      debugger;
    };
  // ,
  // [wrapArrayIndex]
  // );

  useEffect(() => {
    setWrapArrayIndex(wrapArrayIndex);

    if (tvWrap.current && movieWrap.current) {
      window.addEventListener('keydown', handleScroll);
    }
    debugger;

    return () => window.removeEventListener('keydown', handleScroll);
  }, [wrapArrayIndex]);

  //상단 header와 movieList의 area, tvList의 area (ref)
  const wrapArray = useMemo(() => {
    console.log(header, movieWrap, tvWrap);
    debugger;
    return [header, movieWrap, tvWrap];
  }, [header, movieWrap, tvWrap]);
  useEffect(() => {
    debugger;
    console.log(wrapArray);
  }, [wrapArray]);
  const [areaName, setAreaName] = useState('header');
  useEffect(() => {
    alert(scrollY + 'scrollY');
    let v;
    if (scrollY >= 0 && scrollY < movieOffset) {
      v = 'header';
    } else if (scrollY >= movieOffset && scrollY < tvOffset - 50) {
      v = 'movie';
    } else if (scrollY >= tvOffset) {
      v = 'tv';
    }
    console.log('화이팅', scrollY, movieOffset, tvOffset, v);
    setAreaName(v);
  }, [scrollY]);
  const setIndex = useCallback(
    (type, index) => {
      let i = index;
      placedArea.move = false;
      if (type === 'ArrowUp') {
        if (i === 0) {
          setWrapArrayIndex(0);
          return window.scrollTo({ top: 0 });
        }

        i - 1 <= 0 ? (i = 0) : (i = i - 1);
        console.log(wrapArray[i].current.offsetTop);
        window.scrollTo({ top: wrapArray[i].current.offsetTop });
        setScrollY(wrapArray[i].current.offsetTop);
        alert('이거' + wrapArray[i].current.offsetTop);
        return setWrapArrayIndex(i);
      } else if (type === 'ArrowDown') {
        i + 1 <= wrapArray.length - 1 ? (i = i + 1) : (i = i);
        alert(i);

        console.log(wrapArray[i].current?.offsetTop);
        window.scrollTo({ top: wrapArray[i].current.offsetTop });
        setScrollY(wrapArray[i].current.offsetTop);
        return setWrapArrayIndex(prev =>
          prev + 1 <= wrapArray.length - 1 ? prev + 1 : prev
        );
      }
      debugger;
    },
    [wrapArrayIndex]
  );
  const [placedArea, setPlacedArea] = useState({
    position: 0,
    areaName: 'header',
    move: false,
  });

  // useEffect(() => {
  //   if (!placedArea.move) {
  //     window.scrollTo({ top: placedArea.position });
  //     placedArea.move = true;
  //   } else {
  //     return;
  //   }
  // }, [placedArea]);
  // const handleAsync = async (func, set) => {
  //   const res = await func();
  //   set(res?.results);
  // };

  // const getList = async (func, list) => {
  //   dispatch({ type: null });
  //   await func(list);
  //   dispatch({ type: 'success' });
  // };
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const [responseMovieList, responseTvList] = await Promise.all([
        getTopMovie(),
        getTopTv(),
      ]);
      setTopTvList(responseTvList.results);
      setTopMovieList(responseMovieList.results);
    } catch (e) {
      console.log(e);
    } finally {
      setWrapArrayIndex(0);
      window.scrollTo({ top: 0 });
      debugger;
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchList();
    debugger;
  }, [fetchList]);

  const [slideMoveList, slideSetMovieList] = useState([]);
  const [slideTvList, slideSetTvList] = useState([]);
  useEffect(() => {
    setWrapArrayIndex(wrapArrayIndex);
    if (tvWrap.current && movieWrap.current) {
      window.addEventListener('keydown', handleScroll);
    }
    debugger;
    return () => window.removeEventListener('keydown', handleScroll);
  }, [tvWrap.current, movieWrap.current]);

  useEffect(() => {
    if (movieWrap && movieWrap.current) {
      // setMovieOffset(movieWrap.current?.offsetTop);
      movieWrap.current.style.height = window.screen.availHeight + 'px';
      debugger;
    }
  }, [movieWrap.current]);

  useEffect(() => {
    debugger;
    if (tvWrap && tvWrap.current) {
      // setTvOffset(tvWrap.current?.offsetTop);
      tvWrap.current.style.height = window.screen.availHeight + 'px';
    }
  }, [tvWrap.current]);
  const [warnMsg, setWarnMsg] = useState(null);
  const searchEvent = useCallback(
    async e => {
      alert(areaName + '?????');
      console.log(e, 'ss');
      const offset = areaName;
      let areaN = areaName;
      if (areaName === 'header') {
        areaN = 'movie';
      }
      console.log(wrapArray);
      if (e.key === 'Enter') {
        try {
          console.log(wrapArray + 'enter');
          setLoading(true);
          const res = await getSearchMedia(areaN, e.target.value);
          // const res = { results: ['a'] };
          console.log(res);
          if (!res.results.length) {
            setWarnMsg('검색결과가 없다');
            setLoading(false);
            return setModalFlagState(true);
          }
          if (areaN === 'tv') {
            setTopTvList(res.results);
          } else if (areaN === 'movie') {
            setTopMovieList(res.results);
          }
          setLoading(false);
          console.log(placedArea.position);
        } catch (e) {
          setLoading(false);
          console.log(e);
        } finally {
          console.log(wrapArray[1].current, wrapArray, '오프셋');
          if (wrapArrayIndex <= 1) {
            window.scrollTo({ top: wrapArray[1].current.offsetTop });
          } else {
            window.scrollTo({
              top: wrapArray[wrapArrayIndex].current.offsetTop,
            });
          }
        }
      }
      debugger;
    },
    [tvWrap.current, movieWrap.current]
  );

  return (
    <div className={styled.content_wrap}>
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
      {loading ? (
        <ClipLoader color={color} css={override} size={150} />
      ) : (
        <div>
          <Search searchType={searchType} searchEvent={searchEvent}></Search>
          <div ref={movieWrap} className={styled.content}>
            <Carousel
              setLoading={setLoading}
              setList={slideSetMovieList}
              list={topMovieList.slice(0, 5)}
            ></Carousel>
            <div className={styled.post_wrap}>
              <ul>
                {topMovieList.length > 0
                  ? topMovieList
                      .slice(0, Math.abs(topMovieList.length / 2))
                      .map((e, i) => (
                        <li className={styled.post} key={i}>
                          <Img src={e.backdrop_path} />
                        </li>
                      ))
                  : null}
              </ul>
              <ul>
                {topMovieList.length > 0
                  ? topMovieList
                      .slice(Math.abs(topMovieList.length / 2))
                      .map((e, i) => (
                        <li className={styled.post} key={i}>
                          <Img src={e.backdrop_path} />
                        </li>
                      ))
                  : null}
              </ul>
            </div>
          </div>
          <div ref={tvWrap} className={styled.content}>
            <Carousel
              setLoading={setLoading}
              setList={slideSetTvList}
              list={topTvList.slice(0, 5)}
            ></Carousel>
            <div className={styled.post_wrap}>
              <ul className={styled.post_wrap}>
                {topTvList.length > 0
                  ? topTvList
                      .slice(0, Math.abs(topTvList.length / 2))
                      .map((e, i) => (
                        <li className={styled.post} key={i}>
                          <Img src={e.backdrop_path} />
                        </li>
                      ))
                  : null}
              </ul>
              <ul className={styled.post_wrap}>
                {topTvList.length > 0
                  ? topTvList
                      .slice(Math.abs(topTvList.length / 2))
                      .map((e, i) => (
                        <li className={styled.post} key={i}>
                          <Img src={e.backdrop_path} />
                        </li>
                      ))
                  : null}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
