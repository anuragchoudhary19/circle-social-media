import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, NavLink, useLocation, useParams } from 'react-router-dom';
//
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Footer from '../../../Components/Footer/Footer';
import Usercard from '../../../Components/Usercard/Usercard';
import Loader from '../../../Components/Elements/Loader/Loader';
//
import { getFollowers, getFollowing } from '../../../functions/user';
//
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Connections.module.css';

const Connection = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState();
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  const url = useLocation();
  const style = {
    fontWeight: 'bold',
    color: '#087fc4',
    border: '0px solid #3333ff',
    borderWidth: '0 0 5px 0',
  };
  useEffect(() => {
    if (url.pathname === `/${username}/followers`) {
      loadFollowers();
    }
    if (url.pathname === `/${username}/following`) {
      loadFollowing();
    }
  }, []);
  const loadFollowers = () => {
    setLoading(true);
    getFollowers(username, user.token)
      .then((res) => {
        setLoading(false);
        setUsers(res.data.followers);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const loadFollowing = () => {
    setLoading(true);
    getFollowing(username, user.token)
      .then((res) => {
        setLoading(false);
        setUsers(res.data.following);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <header>
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: '1.5rem', color: '#f1f1f1', margin: '0 1rem', cursor: 'pointer' }}
            onClick={() => history.goBack()}
          />
          <h2>Connections</h2>
        </header>
        <nav>
          <ul>
            <li onClick={() => loadFollowers()}>
              <NavLink exact to={`/${username}/followers`} activeStyle={style}>
                Followers
              </NavLink>
            </li>
            <li onClick={() => loadFollowing()}>
              <NavLink exact to={`/${username}/following`} activeStyle={style}>
                Following
              </NavLink>
            </li>
          </ul>
        </nav>
        {loading ? (
          <Loader />
        ) : users?.length ? (
          users.map((user) => <Usercard key={user._id} profile={user} />)
        ) : (
          <div>No User To Follow</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Connection;
