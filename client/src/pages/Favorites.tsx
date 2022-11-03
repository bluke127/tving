import React, { useEffect, useState } from 'react';
import GridCard from 'components/GridCards';
import { useParams } from 'react-router-dom';
import { Row } from 'antd';
import { unknownObj } from 'types/index';

import {
  favorited,
  favorite_number,
  removeFromFavorite,
  addToFavorite,
  getFavoritedMovie,
} from '_actions/favorite_action';

import { useDispatch } from 'react-redux';
import { loadingState } from '../atoms';
import { useRecoilState, useRecoilValue } from 'recoil';

function Favorites() {
  const dispatch = useDispatch();
  const [FavoritesData, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useRecoilState(loadingState);

  useEffect(() => {
    fetchFavorites();
  }, []);
  const fetchFavorites = async () => {
    let response: any;
    setLoading(true);
    try {
      const res: any = await dispatch(
        getFavoritedMovie({ userfrom: sessionStorage.getItem('userInfo') }),
      );
      console.log(res);
      setFavorites(res.payload.favorites);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const loadMoreItems = () => {};
  return (
    <div style={{ width: '100%', margin: '0' }}>
      {/**main image */}
      <div style={{ width: '85%', margin: '1rem auto' }}>
        <h2>Movies by latest</h2>
        <hr />
        {/** Movies Grid Card */}
        <Row gutter={[16, 16]}>
          {FavoritesData &&
            FavoritesData.map((movie: unknownObj, index: number) => (
              <React.Fragment key={index}>
                <GridCard
                  image={
                    movie.movieInfo?.poster_path
                      ? `${process.env.REACT_APP_IMG_URL}/${movie.movieInfo?.poster_path}`
                      : null
                  }
                  movieId={movie.movieId}
                  movieName={movie.movieInfo?.original_title}
                ></GridCard>
              </React.Fragment>
            ))}
        </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={loadMoreItems}>Load More</button>
      </div>
    </div>
  );
}
export default Favorites;
