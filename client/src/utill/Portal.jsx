import ReactDOM from 'react-dom';

const Portal = ({ children }) => {
  const element = document.getElementById('modal-root');
  return ReactDOM.createPortal(children, element);
};

export default Portal;
