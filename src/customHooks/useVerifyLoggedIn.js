import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getUser } from '../functions/user';
import { logout } from '../functions/auth';
import { useDispatch } from 'react-redux';

const setUserInLocalStorage = (res) => {
  window.localStorage.setItem('user', JSON.stringify({ ...res.data }));
};
const setUserInReduxStore = (res, dispatch) => {
  dispatch({
    type: 'LOGGED_IN_USER',
    payload: { ...res.data },
  });
};
export const useVerifyLoggedIn = (token) => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      getUser(token)
        .then((res) => {
          setUserInLocalStorage(res);
          setUserInReduxStore(res, dispatch);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      logout().then((res) => {
        localStorage.setItem('user', '');
        dispatch({
          type: 'LOGOUT',
          payload: '',
        });
        history.push('/');
      });
    }

    return () => getUser;
  }, [dispatch, token, history]);
};
