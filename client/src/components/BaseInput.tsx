import style from 'styled/BaseInput.module.css';
import { forwardRef, useRef } from 'react';
import styled from 'styled-components';
const BaseInput = forwardRef(
  (props: { [key: string]: any }, ref?: React.Ref<HTMLInputElement>) => {
    return (
      <div className={style.input_wrap}>
        {props.beforelabel ? (
          <label
            htmlFor={props.id}
            style={props.style.label}
            className={style.label}
          >
            {props.beforelabel}
          </label>
        ) : null}

        <input
          {...props}
          style={props.style ? props.style.input : null}
          ref={ref}
          className={style.input}
        />
        {props.label ? (
          <label htmlFor={props.id} className={style.label}></label>
        ) : null}
      </div>
    );
  }
);

export default BaseInput;
