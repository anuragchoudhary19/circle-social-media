import React from 'react';
//
import styles from './Options.module.css';

const Options = ({ children, setIsOpen }) => {
  return (
    <div className={styles.page}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
};

export default Options;
