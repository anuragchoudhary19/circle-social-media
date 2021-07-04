import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './LoadingPage.module.css';
const LoadingPage = (props) => {
  return (
    <div className={styles.page}>
      <div className={styles.spinner} style={props.styles}>
        <div className={styles.spinnerSector}></div>
      </div>
      Loading...
    </div>
  );
};

export default LoadingPage;
