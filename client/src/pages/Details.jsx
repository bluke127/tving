import { getDefaultNormalizer } from '@testing-library/react';
import React, { Component, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDetailTv } from 'services/tv';
import { getDetailMovie } from 'services/movie';
import styles from 'styled/Details.module.css';
import CheckBox from 'components/CheckBox';
import ClipLoader from 'react-spinners/ClipLoader';
import Favorate from 'components/Favorate';
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

export default function Details() {
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
  const [favorate, setFavorate] = useRecoilState(favorateState);
  useEffect(() => {
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
  const a = () => {
    console.log(favorate);
    setFavorate({ id, type });
  };

  return (
    <>
      {loading ? (
        <ClipLoader color={color} css={override} size={150} />
      ) : (
        <div className={styles.detail_wrap}>
          <Favorate onClick={(id, type) => a}></Favorate>
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
