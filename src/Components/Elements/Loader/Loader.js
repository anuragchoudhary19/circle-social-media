import React from 'react';
import styles from './Loader.module.css';
const Loader = (props) => {
  return (
    <div className={styles.spinner} style={props.styles}>
      <div className={styles.spinnerSector}></div>
    </div>
  );
};

export default Loader;
