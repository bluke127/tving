import { useEffect, useState, useMemo, useCallback, useRef, lazy } from 'react';
import { Link } from 'react-router-dom';
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
import Banner from 'components/Banner';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getTopMovie, getPopularMovie } from 'services/movie';
// import { getTopMovie } from 'services/movie';
import { getTopTv, getPopularTv } from 'services/tv';
// import { getTopTv } from 'services/tv';
import { getSearchMedia } from 'services/search';
import { css } from '@emotion/react';
import Carousel from 'components/Carousel';
import Search from 'components/Search';
import ColorButton from 'components/ColorButton';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { unknownObj } from 'types/index';
import Img from 'components/Img';

// const Img = lazy(() => import('components/Img'));
export default function Tving() {
  const locatedView = useOutletContext();
  const location = useNavigate();

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

  const [randomContent, setRandomContent]: any = useState([]);
  //movie리스트와 tv리스트를 담아줄 useState
  const [topMovieList, setTopMovieList] = useState<unknownObj[] | null[]>([]);
  const [topTvList, setTopTvList] = useState<unknownObj[] | null[]>([]);
  const [popularMovieList, setPopularMovieList] = useState<
    unknownObj[] | null[]
  >([]);
  const [popularTvList, setPopularTvList] = useState<unknownObj[] | null[]>([]);
  const [searchType, setSearchType] = useState<string>('movie');
  const [movieOffset, setMovieOffset] = useState<number>(0);
  const [tvOffset, setTvOffset] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [loading, setLoading] = useRecoilState(loadingState);
  const movieWrap = useRef(null);
  const tvWrap = useRef(null);
  const [wrapArrayIndex, setWrapArrayIndex] = useState<number>(0);
  const h: { current: HTMLElement } | null = useRecoilValue(headerState);
  const header = useMemo<{ current: null | HTMLElement }>(() => {
    return h ? { current: h } : { current: null };
  }, [h]);
  const [areaName, setAreaName] = useState('header');

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
      scrollY < movieOffset + 10
    ) {
      v = 'movie';
    } else if (scrollY >= movieOffset + 10) {
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
          },
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
    [wrapArrayIndex],
  );
  const [placedArea, setPlacedArea] = useState({
    position: 0,
    areaName: 'header',
    move: false,
  });
  const [pageOffset, setPageOffset] = useState(0);
  const [movieSortType, setMovieSortType] = useState('top');
  const [tvSortType, setTvSortType] = useState('top');

  const fetchList = useCallback(async () => {
    window.scrollTo({ top: 0 });
    try {
      setLoading(true);
      const [responseMovieList, responseTvList] = await Promise.all([
        movieSortType === 'top' ? getTopMovie() : getPopularMovie(),
        tvSortType === 'top' ? getTopTv() : getPopularTv(),
      ]);
      responseTvList.results.length > 0
        ? setTopTvList(
            responseTvList.results.map((e: unknownObj) => {
              e.complete = false;
              return e;
            }),
          )
        : setTopTvList([null]);
      responseMovieList.results.length > 0
        ? setTopMovieList(
            responseMovieList.results.map((e: unknownObj) => {
              e.complete = false;
              return e;
            }),
          )
        : setTopMovieList([null]);
      setRandomContentMethods(
        randomType === 'movie'
          ? responseMovieList.results
          : responseTvList.results,
      );
      console.log(randomContent, 'radom');
    } catch (e) {
      console.log(e);
    } finally {
      if (wrapArrayIndex == null) setWrapArrayIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);
  const setRandomContentMethods = (list: any[]) => {
    const insert = list.filter((e, index) => {
      if (index === Math.floor(Math.random() * list.length)) {
        return e;
      }
    });

    setRandomContent([...insert]);
  };
  useEffect(() => {
    if (!randomContent.length)
      setRandomContentMethods(
        randomType === 'movie' ? topMovieList : topTvList,
      );
  }, [randomContent]);
  const fetchTvList = useCallback(async () => {
    // window.scrollTo({ top: 0 });
    try {
      setLoading(true);
      let responseTvList;
      if (tvSortType === 'top') {
        responseTvList = await getTopTv(0);
      } else {
        responseTvList = await getPopularTv(0);
      }
      responseTvList.results.length > 0
        ? setTopTvList(
            responseTvList.results.map((e: unknownObj) => {
              e.complete = false;
              return e;
            }),
          )
        : setTopTvList([null]);
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    const func = async () => {
      await fetchTvList();
      setLoading(false);
    };
    func();
  }, [tvSortType]);
  const fetchMovieList = useCallback(async () => {
    // window.scrollTo({ top: 0 });
    try {
      setLoading(true);
      let responseMovieList;
      if (movieSortType === 'top') {
        responseMovieList = await getTopMovie(0);
      } else {
        responseMovieList = await getPopularMovie(0);
      }
      responseMovieList.results.length > 0
        ? setTopMovieList(
            responseMovieList.results.map((e: unknownObj) => {
              e.complete = false;
              return e;
            }),
          )
        : setTopMovieList([null]);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    const func = async () => {
      await fetchMovieList();
      setLoading(false);
    };
    func();
  }, [movieSortType]);
  useEffect(() => {
    const setList = async () => {
      await fetchList();
      window.scrollTo({
        top: offset[offset.selectedOffset as string] as number,
      });
      console.log(
        topMovieList,
        [...topMovieList].filter((e, index) => {
          if (index === Math.floor(Math.random() * [...topMovieList].length)) {
            return e;
          }
        }),
      );
    };
    setList();

    setLoading(false);
  }, []);
  const ab = useMemo<boolean>(() => {
    return (topTvList as any[]).every((e) => e.complete);
  }, [topTvList.map((e) => e!.complete)]);
  const b = useMemo<boolean>(() => {
    return (topMovieList as any[]).every((e) => e.complete);
  }, [topMovieList.map((e) => e!.complete)]);
  useEffect(() => {
    completeImgLoaded(
      (topTvList as any[]).every((e) => e!.complete) === true &&
        (topMovieList as any[]).every((e) => e!.complete) === true,
    );
  }, [topTvList.map((e) => e!.complete), topMovieList.map((e) => e!.complete)]);
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
    setLoading(false);
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
            (e.target as HTMLInputElement).value,
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
                  }),
                )
              : setTopTvList([null]);
          } else if (areaN === 'movie') {
            res.results.length > 0
              ? setTopMovieList(
                  res.results.map((e: unknownObj) => {
                    e.complete = false;
                    return e;
                  }),
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
    [tvWrap.current, movieWrap.current, areaName],
  );

  useEffect(() => {
    console.log(movieOffset, tvOffset, '스파이더');
  }, [movieOffset, tvOffset]);

  const completeImgLoaded = (flag?: boolean) => {
    if (
      (topTvList as any[]).every((e) => e.complete) &&
      (topMovieList as any[]).every((e) => e.complete)
    ) {
      setLoading(false);
    }
  };
  const handleComplete = (list: unknownObj[], i: number, t: string) => {
    if (list[0] !== null) {
      list[i].complete = true;
    }
    completeImgLoaded();
  };
  const randomType = useMemo(
    () => (Math.floor(Math.random() * 10) % 2 === 0 ? 'movie' : 'tv'),
    [],
  );
  return (
    <div className={styled.content_wrap}>
      <div style={{ width: '100px', height: '50px', position: 'fixed' }}>
        {areaName + '에러이알 넴임'}
        {movieOffset + 'movieOffset'}
        {tvOffset + 'tvOffset'}
        {scrollY + 'scrollY'}
        <Link
          to={`/movieList/${areaName !== 'tv' ? 'movie' : 'tv'}/${
            areaName !== 'tv' ? movieSortType : tvSortType
          }`}
          style={{ fontSize: '50px', color: 'blue' }}
        >
          {areaName}
        </Link>
      </div>
      <div>
        <Search searchType={searchType} searchEvent={searchEvent}></Search>
        <Banner
          list={randomContent[0] || randomContent}
          type={randomType}
          id={randomContent[0] ? randomContent[0]?.id : ''}
        />
        <Element name="movieWrap">
          <div ref={movieWrap} className={styled.content}>
            <ColorButton
              onClick={() => {
                setMovieSortType('top');
              }}
            >
              인기순
            </ColorButton>
            <ColorButton
              onClick={() => {
                setMovieSortType('popular');
              }}
            >
              최신순
            </ColorButton>
            <Carousel
              setLoading={setLoading}
              setList={slideSetMovieList}
              list={topMovieList[0] !== null ? topMovieList.slice(0, 5) : []}
            ></Carousel>
            <div className={styled.post_wrap}>
              <ul>
                {topMovieList && topMovieList.length
                  ? topMovieList
                      .slice(0, Math.abs(topMovieList.length / 2))
                      .map((e, i) => (
                        <li
                          className={
                            e!.backdrop_path ? styled.post : styled.empty_img
                          }
                          key={i}
                        >
                          <Link to={`/movie/${e!.id}`}>
                            <Img
                              src={e!.backdrop_path}
                              onLoad={() => {
                                handleComplete(
                                  topMovieList as unknownObj[],
                                  i,
                                  'load',
                                );
                                e!.complete = true;
                              }}
                              onError={() => {
                                handleComplete(
                                  topMovieList as unknownObj[],
                                  i,
                                  'load',
                                );
                                e!.complete = true;
                              }}
                              // onError={handleComplete(topMovieList, i)}
                            />
                          </Link>
                        </li>
                      ))
                  : null}
              </ul>
              <ul>
                {topMovieList && topMovieList.length
                  ? topMovieList
                      .slice(Math.abs(topMovieList.length / 2))
                      .map((e, i) => (
                        <li
                          className={
                            e!.backdrop_path ? styled.post : styled.empty_img
                          }
                          key={i}
                        >
                          <Link to={`/movie/${e!.id}`}>
                            <Img
                              src={e!.backdrop_path}
                              onLoad={() => {
                                handleComplete(
                                  topMovieList as unknownObj[],
                                  i + Math.abs(topMovieList.length / 2),
                                  'load',
                                );
                                e!.complete = true;
                              }}
                              onError={() => {
                                handleComplete(
                                  topMovieList as unknownObj[],
                                  i + Math.abs(topMovieList.length / 2),
                                  'load',
                                );
                                e!.complete = true;
                              }}
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
            <ColorButton
              onClick={() => {
                setTvSortType('top');
              }}
            >
              인기순
            </ColorButton>
            <ColorButton
              onClick={() => {
                setTvSortType('popular');
              }}
            >
              최신순
            </ColorButton>
            <Carousel
              setLoading={setLoading}
              setList={slideSetTvList}
              list={topTvList[0] !== null ? topTvList.slice(0, 5) : []}
            ></Carousel>
            <div className={styled.post_wrap}>
              <ul>
                {topTvList && topTvList.length
                  ? topTvList
                      .slice(0, Math.abs(topTvList.length / 2))
                      .map((e, i) => (
                        <li
                          className={
                            e!.backdrop_path ? styled.post : styled.empty_img
                          }
                          key={i}
                        >
                          <Link to={`/tv/${e!.id}`}>
                            <Img
                              src={e!.backdrop_path}
                              onLoad={() => {
                                handleComplete(
                                  topTvList as unknownObj[],
                                  i,
                                  'load',
                                );

                                e!.complete = true;
                              }}
                              onError={() => {
                                handleComplete(
                                  topTvList as unknownObj[],
                                  i,
                                  'load',
                                );
                                e!.complete = true;
                              }}
                              // onError={handleComplete(topTvList, i)}
                            />
                          </Link>
                        </li>
                      ))
                  : null}
              </ul>
              <ul>
                {topTvList && topTvList.length
                  ? topTvList
                      .slice(Math.abs(topTvList.length / 2))
                      .map((e, i) => (
                        <li
                          className={
                            e!.backdrop_path ? styled.post : styled.empty_img
                          }
                          key={i}
                        >
                          <Link to={`/tv/${e!.id}`}>
                            <Img
                              src={e!.backdrop_path}
                              onLoad={() => {
                                handleComplete(
                                  topTvList as unknownObj[],
                                  i + Math.abs(topTvList.length / 2),
                                  'load',
                                );
                                e!.complete = true;
                              }}
                              onError={() => {
                                handleComplete(
                                  topTvList as unknownObj[],
                                  i + Math.abs(topTvList.length / 2),
                                  'load',
                                );
                                e!.complete = true;
                              }}
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
