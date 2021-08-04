import { useEffect } from 'react';
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
  const dispatch = useDispatch();
  useEffect(() => {
    getUser(token)
      .then((res) => {
        setUserInLocalStorage(res);
        setUserInReduxStore(res, dispatch);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => getUser;
  }, [dispatch, token]);
};
