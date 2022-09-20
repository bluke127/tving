import React from 'react';
import { Col } from 'antd';
import { Link } from 'react-router-dom';
function GridCard(props) {
  return (
    <Col lg={6} md={8} xs={24}>
      <div style={{ position: 'relative' }}>
        <Link to={`/movie/${props.movieId}`}>
          <img src={props.image} alt={props.movieName} />
        </Link>
      </div>
    </Col>
  );
}
export default GridCard;
