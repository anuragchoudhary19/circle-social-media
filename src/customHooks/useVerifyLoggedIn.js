import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getUser } from '../functions/user';
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
      if (history?.location?.pathname !== '/signup') {
        history.push('/');
      }
    }
  }, [dispatch, token, history]);
};
