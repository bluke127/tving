import React, { useEffect, useState, useMemo } from 'react';
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

  // const { movieId } = useParams();
  let variables = {
    userFrom: props.userFrom,
    // movieId: movieId,
    movieId: props.info?.id,
  };
  const [active, setActive] = useState(false);
  const activeFlag = useMemo(() => active, [active]);
  const { execute } = UseAsync(() => dispatch(addToFavorite(variables)), false);
  return (
    <>
      {activeFlag}
      <span
        className={styled.img}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <Img
          className={styled.favorate_img}
          {...props}
          isapiresponse={+true}
          onClick={execute}
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
