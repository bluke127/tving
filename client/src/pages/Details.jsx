import React, { Component, useEffect, useState, useCallback } from 'react';
import { getDefaultNormalizer } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from 'styled/Details.module.css';
import { getDetailTv } from 'services/tv';
import { getDetailMovie } from 'services/movie';

import { useDispatch } from 'react-redux';
import UseAsync from 'utill/useAsync';
import CheckBox from 'components/CheckBox';
import ClipLoader from 'react-spinners/ClipLoader';
import Favorite from 'components/Favorate';
import { loadingState, favorateState } from '../atoms';

import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from 'recoil';
import Img from 'components/Img';
import { css } from '@emotion/react';
import { useMemo } from 'react';
import {
  favorited,
  favorite_number,
  removeFromFavorite,
  addToFavorite,
} from '_actions/favorite_action';
export default function Details() {
  const dispatch = useDispatch();
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    background-color: blue !important;
  `;
  let [color, setColor] = useState('#ffffff');
  const dontShow = [
    'budget',
    'id',
    'imdb_id',
    'video',
    'vote_average',
    'vote_count',
  ];
  const getDetail = async () => {
    let res;
    if (type === 'movie') {
      res = await getDetailMovie(id);
    } else if (type === 'tv') {
      res = await getDetailTv(id);
    }
    setResponse(res);
  };
  const [response, setResponse] = useState();
  const [loading, setLoading] = useRecoilState(loadingState);
  useEffect(() => {
    setLoading(true);
    getDetail();
    setLoading(false);
  }, [loading]);
  const currentFavorateState = useMemo(() => {
    // favorate.includes();
  });
  // useEffect(() => {
  //   if (favorate) setFavorate({ id, type });
  // }, [favorate]);
  const { type, id } = useParams();

  // const handlefavorite = async () => {
  let { execute } = UseAsync(async () => {
    console.log(response, 'responses');
    return {
      favorited: await dispatch(
        favorited({
          userfrom: sessionStorage.getItem('userInfo'),
          movieId: response?.id,
          cate: type,
        }),
      ),
      favoriteNumber: await dispatch(
        favorite_number({
          userfrom: sessionStorage.getItem('userInfo'),
          movieId: response?.id,
          cate: type,
        }),
      ),
    };
  }, false);
  // execute();
  // };
  return (
    <>
      {loading ? (
        <ClipLoader color={color} css={override} size={150} />
      ) : (
        <div className={styles.detail_wrap}>
          <Favorite
            info={response}
            userfrom={sessionStorage.getItem('userInfo')}
            handlefavorite={() => execute()}
          />
          <ul>
            {response
              ? Object.entries(response).map(([key, value], index) => (
                  <li key={index}>
                    <b style={{ fontSize: '24px' }}>{key}</b>
                    {key === 'adult' ? (
                      <CheckBox value={value}></CheckBox>
                    ) : key === 'backdrop_path' ? (
                      <Img src={value} />
                    ) : value && !dontShow.includes(value) ? (
                      JSON.stringify(value)
                    ) : (
                      ''
                    )}
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </>
  );
}
