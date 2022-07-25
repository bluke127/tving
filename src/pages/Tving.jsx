import React, {
  Component,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
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
const scroll = animateScroll;
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
  const a = useRecoilValue(userIdState);

  // const location = useNavigate();
  // const id = useRecoilValue(userIdState);
  // useEffect(() => {
  //   if (!id) location('/');
  // }, [id]);
  const handleScroll = event => {
    event.preventDefault();
    setIndex(event.key, wrapArrayIndex);
    setScrollY(window.scrollY);
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
    return [header, movieWrap, tvWrap];
  }, [header, movieWrap, tvWrap]);
  useEffect(() => {
    console.log(wrapArray);
  }, [wrapArray]);
  const [areaName, setAreaName] = useState('header');
  useEffect(() => {
    let v;
    if (scrollY >= 0 && scrollY < movieOffset) {
      v = 'header';
    } else if (scrollY >= movieOffset && scrollY < tvOffset) {
      v = 'movie';
    } else if (scrollY >= tvOffset) {
      v = 'tv';
    }
    console.log('화이팅', scrollY + 5, movieOffset, tvOffset, v, areaName);
    setAreaName(v);
  }, [scrollY]);
  const setIndex = useCallback(
    (type, index) => {
      let i = index;
      placedArea.move = false;
      console.log(wrapArray, 'wrapArray');
      if (type === 'ArrowUp') {
        if (i === 0) {
          setWrapArrayIndex(0);
          return scroll.scrollTo(0, {
            top: 0,
            duration: 300,
          });
        }
        i - 1 <= 0 ? (i = 0) : (i = i - 1);
        setScrollY(wrapArray[i].current ? 0 : wrapArray[i].current.offsetTop);
        scroll.scrollTo(wrapArray[i].current.offsetTop, {
          top: wrapArray[i].current.offsetTop,
          duration: 300,
        });

        return setWrapArrayIndex(wrapArray[i].current ? 0 : i);
      } else if (type === 'ArrowDown') {
        i + 1 <= wrapArray.length ? (i = i + 1) : (i = i);
        scroll.scrollTo(wrapArray[i].current.offsetTop, {
          duration: 300,
        });
        setScrollY(wrapArray[i].current.offsetTop);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchList();
  }, []);

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
      setMovieOffset(movieWrap.current?.offsetTop);
      movieWrap.current.style.height = window.screen.availHeight + 'px';
    }
  }, [movieWrap.current]);

  useEffect(() => {
    if (tvWrap && tvWrap.current) {
      setTvOffset(tvWrap.current?.offsetTop);
      tvWrap.current.style.height = window.screen.availHeight + 'px';
    }
  }, [tvWrap.current]);
  const [warnMsg, setWarnMsg] = useState(null);
  const searchEvent = useCallback(
    async e => {
      console.log(wrapArray[wrapArrayIndex], wrapArray, wrapArrayIndex);
      debugger;
      let areaN = areaName;
      if (areaName === 'header') {
        areaN = 'movie';
      }

      if (e.key === 'Enter') {
        try {
          console.log(wrapArray + 'enter');
          setLoading(true);
          const res = await getSearchMedia(areaN, e.target.value);
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
          console.log(
            localStorage.getItem('offset') + 'px',
            typeof localStorage.getItem('offset')
          );
          setLoading(false);
          console.log(placedArea.position);
        } catch (e) {
          setLoading(false);
          console.log(e);
        } finally {
          console.log(wrapArray[1].current, wrapArray, '오프셋');
          // if (wrapArrayIndex <= 1) {
          //   window.scrollTo({ top: wrapArray[1].current.offsetTop });
          // } else {
          // }
        }
      }
    },
    [tvWrap.current, movieWrap.current]
  );
  useEffect(() => {
    if (localStorage.getItem('offset')) {
      window.scrollTo({
        top: pageOffset,
      });
    }
  }, [loading]);

  return (
    <div className={styled.content_wrap}>
      <div style={{ width: '100px', height: '50px', position: 'fixed' }}>
        {areaName}
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
              list={topMovieList.slice(0, 5)}
            ></Carousel>
            <div className={styled.post_wrap}>
              <ul>
                {topMovieList.length > 0
                  ? topMovieList
                      .slice(0, Math.abs(topMovieList.length / 2))
                      .map((e, i) => (
                        <li className={styled.post} key={i}>
                          <Link to={`/main/movie/${e.id}`}>
                            <Img src={e.backdrop_path} />
                          </Link>
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
                          <Link to={`/main/movie/${e.id}`}>
                            <Img src={e.backdrop_path} />
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
              list={topTvList.slice(0, 5)}
            ></Carousel>
            <div className={styled.post_wrap}>
              <ul>
                {topTvList.length > 0
                  ? topTvList
                      .slice(0, Math.abs(topTvList.length / 2))
                      .map((e, i) => (
                        <li className={styled.post} key={i}>
                          <Link to={`/main/tv${e.id}`}>
                            <Img src={e.backdrop_path} />
                          </Link>
                        </li>
                      ))
                  : null}
              </ul>
              <ul>
                {topTvList.length > 0
                  ? topTvList
                      .slice(Math.abs(topTvList.length / 2))
                      .map((e, i) => (
                        <li className={styled.post} key={i}>
                          <Link to={`/main/tv${e.id}`}>
                            <Img src={e.backdrop_path} />
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
