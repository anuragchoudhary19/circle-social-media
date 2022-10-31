import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Switch, Route, useRouteMatch, NavLink, useHistory } from 'react-router-dom';
//
import { getProfile } from '../../../functions/user';
//
import UserProfile from './UserProfile/UserProfile';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Footer from '../../../Components/Footer/Footer';
import Tweets from './Nav/Tweets';
import Likes from './Nav/Likes';
import Replies from './Nav/Replies';
import Recommendations from '../Recommendations/Recommendations';
//
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Profile.module.css';
import Media from './Nav/Media';

const Profile = () => {
  const [profile, setProfile] = useState();
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const { url, path } = useRouteMatch();
  const { username } = useParams();
  const history = useHistory();
  const header = useRef();
  const main = useRef();
  useEffect(() => {
    const element = main.current;
    element.addEventListener('scroll', displayHeader);
    return () => element.removeEventListener('scroll', displayHeader);
  }, []);
  useEffect(() => {
    document.addEventListener('keydown', scrollPage);
    return () => document.removeEventListener('keydown', scrollPage);
  });
  const scrollPage = (e) => {
    if (e.code === 'Home') {
      main.current.scrollTop = 0;
    }
  };
  useEffect(() => {
    if (!user?.token) {
      history.push('/');
    }
  }, [history, user]);
  const displayHeader = (e) => {
    if (e.target.scrollTop < 55) {
      header.current.style.display = 'none';
    }
    if (e.target.scrollTop > 200) {
      header.current.style.display = 'flex';
    }
  };
  const loadProfile = useCallback(async () => {
    try {
      let res = await getProfile(username, user.token);
      setProfile({ ...res.data.profile });
    } catch (e) {
      setError("Couldn't load profile");
    }
  }, [user.token, username]);
  useEffect(() => {
    loadProfile();
    return () => loadProfile();
  }, [username, user, loadProfile]);

  const style = {
    fontWeight: 'bold',
    color: '#087fc4',
    border: '0px solid #3333ff',
    borderWidth: '0 0 5px 0',
  };
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main} ref={main}>
        <div ref={header}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={{ fontSize: '1.5rem', color: '#f1f1f1', margin: '0 1rem', cursor: 'pointer' }}
            onClick={() => history.goBack()}
          />
          <h2>Profile</h2>
        </div>
        <div className={styles.profile}>
          {error && <div style={{ color: 'white', textAlign: 'center' }}>{error}</div>}
          {profile?._id && <UserProfile profile={profile} />}
        </div>
        <nav>
          <ul>
            <li>
              <NavLink exact to={`${url}`} activeStyle={style}>
                Tweets
              </NavLink>
            </li>
            <li>
              <NavLink to={`${url}/replies`} activeStyle={style}>
                Replies
              </NavLink>
            </li>
            <li>
              <NavLink to={`${url}/media`} activeStyle={style}>
                Media
              </NavLink>
            </li>
            <li>
              <NavLink to={`${url}/likes`} activeStyle={style}>
                Likes
              </NavLink>
            </li>
          </ul>
        </nav>
        {profile?._id && (
          <Switch>
            <Route exact path={`${path}`} component={() => <Tweets userId={profile._id} user={user} />} />
            <Route
              path={`${path}/replies`}
              component={() => <Replies userId={profile._id} profile={profile} user={user} />}
            />
            <Route
              path={`${path}/media`}
              component={() => <Media userId={profile._id} profile={profile} user={user} />}
            />
            <Route
              path={`${path}/likes`}
              component={() => <Likes userId={profile._id} profile={profile} user={user} />}
            />
          </Switch>
        )}
      </div>
      <Footer>
        <Recommendations />
      </Footer>
    </div>
  );
};

export default Profile;
