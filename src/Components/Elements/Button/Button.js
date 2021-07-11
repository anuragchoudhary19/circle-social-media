import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import styles from './Button.module.css';
const Button = (props) => {
  const [style, setStyle] = useState([styles.button]);
  useEffect(() => {
    if (props.outline) {
      setStyle([...style, styles.outlined]);
    } else {
      setStyle([...style, styles.solid]);
    }
  }, []);

  return (
    <div className={style.join(' ')} style={props.style} onClick={props.onClick}>
      {props.loading && <Loader />}
      <button type={props.type || 'button'}>{props.text}</button>
    </div>
  );
};

export default Button;
