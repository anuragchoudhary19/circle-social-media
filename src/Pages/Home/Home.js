import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Button from '../../Components/Elements/Button/Button';
import { logout } from '../../functions/auth';
const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    logout().then((res) => {
      localStorage.setItem('user', '');
      dispatch({
        type: 'LOGOUT',
        payload: '',
      });
      history.push('/');
      console.log(res.data.message);
    });
  };
  return (
    <div>
      <Button text='Logout' onClick={handleLogout} />
    </div>
  );
};

export default Home;
