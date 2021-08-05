import React, { useEffect, useState, useCallback } from 'react';
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
import styles from './Profile.module.css';

const Profile = () => {
  const [profile, setProfile] = useState();
  const [error, setError] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const { url, path } = useRouteMatch();
  const { username } = useParams();
  const history = useHistory();
  useEffect(() => {
    if (!user?.token) {
      history.push('/');
    }
  }, [history, user]);
  const loadProfile = useCallback(() => {
    getProfile(username, user.token)
      .then((res) => {
        setProfile(res.data.profile);
      })
      .catch((err) => {
        setError("Couldn't load profile");
      });
  }, [user.token, username]);
  useEffect(() => {
    loadProfile();
    return () => {
      loadProfile();
      setProfile();
      setError('');
    };
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
      <div className={styles.main}>
        <div className={styles.profile}>
          {error && <div style={{ color: 'white', textAlign: 'center' }}>{error}</div>}
          {profile && <UserProfile profile={profile} />}
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
        {profile && (
          <Switch>
            <Route exact path={`${path}`} component={() => <Tweets userId={profile._id} user={user} />} />
            <Route
              path={`${path}/replies`}
              component={() => <Replies userId={profile._id} profile={profile} user={user} />}
            />
            <Route
              path={`${path}/media`}
              component={() => <Replies userId={profile._id} profile={profile} user={user} />}
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
