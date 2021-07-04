import React from 'react';
import Loader from '../Loader/Loader';
import styles from './Button.module.css';
const Button = (props) => {
  return (
    <div className={styles.element} onClick={props.onClick} style={{ width: props.width ? props.width : 'default' }}>
      <div className={styles.button} style={props.style}>
        {props.loading && <Loader />}
        <button type={props.type}>{props.text}</button>
      </div>
    </div>
  );
};

export default Button;
