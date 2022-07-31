export default function BaseInput(props) {
  return (
    <>
      <input {...props} />
      {props.label ? <label htmlFor={props.id}></label> : null}
    </>
  );
}
