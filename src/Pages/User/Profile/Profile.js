import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import UserProfile from './UserProfile/UserProfile';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Footer from '../../../Components/Footer/Footer';
import Loader from '../../../Components/Elements/Loader/Loader';
import Statuses from './Nav/Statuses';
import Likes from './Nav/Likes';
import { getProfile } from '../../../functions/user';
import Recommendations from '../Recommendations/Recommendations';
import styles from './Profile.module.css';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  useEffect(() => {
    loadProfile();
  }, [username, user.token, user.username]);

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
  const loadPathname = () => {
    if (!profile._id) return null;
    if (history.location.pathname === `/${username}`) {
      return <Statuses profile={profile} user={user} />;
    }
    if (history.location.pathname === `/${username}/replies`) {
      return <Statuses profile={profile} user={user} />;
    }
    if (history.location.pathname === `/${username}/media`) {
      return <Statuses profile={profile} user={user} />;
    }
    if (history.location.pathname === `/${username}/likes`) {
      return <Likes username={username} profile={profile} user={user} />;
    }
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        {loading ? <Loader styles={{ width: '40px', height: '40px' }} /> : <UserProfile profile={profile} />}
        {!loading && profile && loadPathname()}
      </div>
      <Footer>
        <Recommendations />
      </Footer>
    </div>
  );
};

export default Profile;
