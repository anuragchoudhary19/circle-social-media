import React from 'react';
import styles from './LoadingPage.module.css';
const LoadingPage = (props) => {
  return (
    <div className={styles.page}>
      <div className={styles.spinner} style={props.styles}>
        <div className={styles.spinnerSector}></div>
      </div>
    </div>
  );
};

export default LoadingPage;
