import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Switch, Route, useRouteMatch, NavLink } from 'react-router-dom';
import UserProfile from './UserProfile/UserProfile';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Footer from '../../../Components/Footer/Footer';
import Loader from '../../../Components/Elements/Loader/Loader';
import Tweets from './Nav/Tweets';
import Likes from './Nav/Likes';
import Replies from './Nav/Replies';
import { getProfile } from '../../../functions/user';
import Recommendations from '../Recommendations/Recommendations';
import styles from './Profile.module.css';

const Profile = () => {
  const { username } = useParams();

  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const { url, path } = useRouteMatch();

  useEffect(() => {
    loadProfile();
  }, [username, user]);

  const loadProfile = () => {
    setLoading(true);
    getProfile(username, user.token)
      .then((res) => {
        setProfile(res.data.profile);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
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
        {!profile ? <Loader styles={{ width: '40px', height: '40px' }} /> : <UserProfile profile={profile} />}
        <nav>
          <ul>
            <li>
              <NavLink exact to={`${url}`} activeStyle={style}>
                Posts
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
            <Route path={`${path}/replies`} component={() => <Replies profile={profile} user={user} />} />
            <Route path={`${path}/media`} component={() => <Replies profile={profile} user={user} />} />
            <Route
              path={`${path}/likes`}
              component={() => <Likes username={username} profile={profile} user={user} />}
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
