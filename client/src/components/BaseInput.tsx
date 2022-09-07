import { forwardRef, useRef } from 'react';
const BaseInput = forwardRef(
  (props: { [key: string]: any }, ref?: React.Ref<HTMLInputElement>) => {
    return (
      <>
        {props.beforelabel ? (
          <label htmlFor={props.id} style={props.style.label}>
            {props.beforelabel}
          </label>
        ) : null}

        <input
          {...props}
          style={props.style ? props.style.input : null}
          ref={ref}
        />
        {props.label ? <label htmlFor={props.id}></label> : null}
      </>
    );
  }
);

export default BaseInput;
