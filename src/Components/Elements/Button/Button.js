import React from 'react';
import Loader from '../Loader/Loader';
import styles from './Button.module.css';
const Button = (props) => {
  const { btnStyle, btnSize, children, loading, type, onClick } = props;
  const STYLES = [
    'primarySolid',
    'warningSolid',
    'dangerSolid',
    'successSolid',
    'primaryOutline',
    'warningOutline',
    'dangerOutline',
    'successOutline',
  ];
  const SIZES = ['md', 'sm'];
  const checkBtnStyle = STYLES.includes(btnStyle) ? btnStyle : STYLES[0];
  const checkBtnSize = SIZES.includes(btnSize) ? btnSize : SIZES[0];
  return (
    <div className={`${styles.btn} ${styles[checkBtnStyle]} ${styles[checkBtnSize]}`} onClick={onClick}>
      {loading && <Loader />}
      <button type={type}>{children}</button>
    </div>
  );
};

export default Button;
