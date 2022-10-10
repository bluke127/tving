import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled/Favorate.module.css';
import Img from 'components/Img';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {
  favorited,
  favorite_number,
  removeFromFavorite,
  addToFavorite,
} from '_actions/favorite_action';
import { useDispatch } from 'react-redux';
import UseAsync from 'utill/useAsync';
export default function Favorate(props: any) {
  const dispatch = useDispatch();
  const { type } = useParams();
  let variables = {
    userfrom: props.userfrom,
    // movieId: movieId,
    movieId: props.info?.id,
    cate: type,
  };
  const [active, setActive] = useState(false);
  const activeFlag = useMemo(() => active, [active]);
  const [FavoriteNumber, setFavoriteNumber] = useState(0);
  const setFavorite = () => {
    if (active) {
      // UseAsync(() =>
      dispatch(removeFromFavorite(variables));
      // , false).execute();
    } else {
      // UseAsync(() =>
      dispatch(addToFavorite(variables));
      // , false).execute();
    }
  };
  let { execute } = UseAsync(() => dispatch(addToFavorite(variables)), false);
  useEffect(() => {
    const mountFunc = async () => {
      const res = await props.handlefavorite();
      console.log(res, 'resres');
      setActive(res.payload.favorited);
    };
    mountFunc();
  }, []);
  return (
    <>
      {activeFlag}
      <span className={styled.img} onClick={() => setFavorite()}>
        <Img
          className={styled.favorate_img}
          isapiresponse={+true}
          src={
            !props.favorate && !activeFlag
              ? require('assets/images/favorite.svg').default
              : require('assets/images/favorite-active.svg').default
          }
        />
      </span>
    </>
  );
}
