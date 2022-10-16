import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api, { API_KEY } from 'utill/axios';
import GridCard from 'components/GridCards';
import { useParams } from 'react-router-dom';
import { Row } from 'antd';
import { unknownObj } from 'types/index';

import { loadingState } from '../atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { handleMovieListByType } from 'services/movie';
import { handleTvListByType } from 'services/tv';
function MoviesList() {
  const [Movies, setMovies] = useState<any[]>([]);
  const { category, type } = useParams();
  const [CurrentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useRecoilState(loadingState);

  useEffect(() => {
    fetchMovies(category as string, type as string);
  }, []);
  const fetchMovies = async (_category: string, _type: string | number) => {
    let response: any;
    setLoading(true);
    try {
      if (_category !== 'tv') {
        response = await handleMovieListByType(CurrentPage, _type);
      } else {
        response = await handleTvListByType(CurrentPage, _type);
      }
      setMovies([...Movies, ...response.results]);
      setCurrentPage(response.page);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const loadMoreItems = () => {
    setCurrentPage(CurrentPage + 1);
    fetchMovies(category as string, type as string | number);
  };
  return (
    <div style={{ width: '100%', margin: '0' }}>
      {/**main image */}
      <div style={{ width: '85%', margin: '1rem auto' }}>
        <h2>Movies by latest</h2>
        <hr />

        {/** Movies Grid Card */}
        <Row gutter={[16, 16]}>
          {Movies &&
            Movies.map((movie: unknownObj, index: number) => (
              <React.Fragment key={index}>
                <GridCard
                  image={
                    movie.poster_path
                      ? `${process.env.REACT_APP_IMG_URL}/${movie.poster_path}`
                      : null
                  }
                  movieId={movie.id}
                  movieName={movie.original_title}
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
export default MoviesList;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import api, { API_KEY } from 'utill/axios';

// import GridCard from 'components/GridCards';
// import { Row } from 'antd';
// function LandingPage() {
//   const [Movie, setMovies] = useState([]);
//   const [CurrentPage, setCurrentPage] = useState(0);
//   useEffect(() => {
//     const endPoint = `${process.env.REACT_APP_API_URL}/movie/popular?api_key=${API_KEY}&language=en-US`;
//     fetchMovies(endPoint);
//   }, []);
//   const fetchMovies = endPoint => {
//     console.log(endPoint);
//     fetch(endPoint)
//       .then(response => response.json())
//       .then(response => {
//         setMovies([...Movie, ...response.results]);
//         setCurrentPage(response.page);
//       });
//   };
//   const loadMoreItems = () => {
//     const endPoint = `${
//       process.env.REACT_APP_API_URL
//     }movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
//     fetchMovies(endPoint);
//   };
//   return (
//     <div style={{ width: '100%', margin: '0' }}>
//       {/**main image */}
//       <div style={{ width: '85%', margin: '1rem auto' }}>
//         <h2>Movies by latest</h2>
//         <hr />
//         {/** Movie Grid Card */}
//         <Row gutter={[16, 16]}>
//           {Movie &&
//             Movie.map((movie, index) => (
//               <React.Fragment key={index}>
//                 <GridCard
//                   image={
//                     movie.poster_path
//                       ? `${process.env.REACT_APP_IMG_URL}${movie.poster_path}`
//                       : null
//                   }
//                   movieId={movie.id}
//                   movieName={movie.original_title}
//                 ></GridCard>
//               </React.Fragment>
//             ))}
//         </Row>
//       </div>
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <button onClick={loadMoreItems}>Load More</button>
//       </div>
//     </div>
//   );
// }
// export default LandingPage;
