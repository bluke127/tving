import { forwardRef, useRef } from 'react';
const BaseInput = forwardRef(
  (props: { [key: string]: any }, ref: React.Ref<HTMLInputElement>) => {
    return (
      <>
        <input {...props} ref={ref} />
        {props.label ? <label htmlFor={props.id}></label> : null}
      </>
    );
  }
);

export default BaseInput;
