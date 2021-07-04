import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, Switch, Route } from 'react-router-dom';
import Button from '../../Components/Elements/Button/Button';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Footer from '../../Components/Footer/Footer';

import { getAllUsers } from '../../functions/user';

import styles from './Home.module.css';

const Connect = () => {
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));
  // useEffect(() => {
  //   loadProfile();
  // }, []);

  // const loadProfile = () => {
  //   getAllUsers(user.token).then((res) => {
  //     setUsers(res.data.users);
  //     console.log(res.data);
  //   });
  // };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        {/* {loading ? <Loader styles={{ width: '40px', height: '40px' }} /> : <UserProfile profile={profile} />} */}
      </div>
      <Footer />
    </div>
  );
};

export default Connect;
