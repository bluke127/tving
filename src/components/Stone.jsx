import React, { useEffect } from 'react';
import { stone, AreaSpanForCenter } from 'styled/style';

export default function Stone({ stone, classN }) {
  return (
    <p className={classN}>
      <span>{stone}</span>
    </p>
  );
}
