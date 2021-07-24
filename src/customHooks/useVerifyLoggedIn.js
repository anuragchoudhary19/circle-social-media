import { useEffect } from 'react';
import { getUser } from '../functions/user';
import { useDispatch } from 'react-redux';

const setUserInLocalStorage = (res, token) => {
  window.localStorage.setItem('user', JSON.stringify({ ...res.data }));
};
const setUserInReduxStore = (res, token, dispatch) => {
  dispatch({
    type: 'LOGGED_IN_USER',
    payload: { ...res.data },
  });
};
export const useVerifyLoggedIn = (token) => {
  const dispatch = useDispatch();
  useEffect(() => {
    getUser(token)
      .then((res) => {
        setUserInLocalStorage(res, token);
        setUserInReduxStore(res, token, dispatch);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => getUser;
  }, [dispatch, token]);
};
