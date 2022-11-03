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
  const [favoriteNumber, setFavoriteNumber] = useState(0);
  const setFavorite = async () => {
    if (active) {
      // UseAsync(() =>
      alert(favoriteNumber);
      await dispatch(removeFromFavorite(variables));
      setActive(!active);
      setFavoriteNumber((prev) => (prev = prev - 1));
    } else {
      await dispatch(addToFavorite(variables));
      setActive(!active);
      setFavoriteNumber((prev) => (prev = prev + 1));
    }
  };
  let { execute } = UseAsync(() => dispatch(addToFavorite(variables)), false);
  useEffect(() => {
    const mountFunc = async () => {
      if (!props.info) {
        return;
      }
      console.log(props.handlefavorite, props.info, props.userfrom, '?');
      const res = await props.handlefavorite();
      console.log(res, 'resres');
      setActive(res.favorited.payload.favorited);
      setFavoriteNumber(res.favoriteNumber.payload.favoriteNumber);
    };
    mountFunc();
  }, []);
  return (
    <>
      {activeFlag + '멈니까'}
      <span className={styled.img} onClick={() => setFavorite()}>
        {favoriteNumber}
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
});
