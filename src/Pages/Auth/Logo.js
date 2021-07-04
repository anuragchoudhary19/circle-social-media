import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

const Auth = () => {
  return (
    <div className={styles.logo}>
      <Link to={'/'}>
        <header>Circle</header>
      </Link>
    </div>
  );
};

export default Auth;
