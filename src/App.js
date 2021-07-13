import React, { useEffect, lazy, Suspense, useState, useRef, useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { unsubscribe } from './functions/user';

import LoadingPage from './Components/LoadingPage/LoadingPage';
import './App.css';
const PrivateRoute = lazy(() => import('./Components/Routes/PrivateRoute'));
const Signup = lazy(() => import('./Pages/Auth/Signup/Signup'));
const Login = lazy(() => import('./Pages/Auth/Login/Login'));
const Profile = lazy(() => import('./Pages/User/Profile/Profile'));
const Post = lazy(() => import('./Pages/User/StatusExpanded/StatusExpanded'));
const Settings = lazy(() => import('./Pages/User/Settings'));
const Connect = lazy(() => import('./Pages/User/Connect/Connect'));
const Connections = lazy(() => import('./Pages/User/Connections/Connections'));
const Home = lazy(() => import('./Pages/User/Home/Home'));

export const SocketContext = React.createContext();

function App() {
  const { user } = useSelector((state) => ({ ...state }));
  const { current: token } = useRef(user?.token);
  const dispatch = useCallback(() => useDispatch, []);
  const [socket, setSocket] = useState();
  useEffect(() => {
    setSocket(
      io(process.env.REACT_APP_API_SOCKET_IO_URL, {
        transports: ['websocket', 'polling', 'flashsocket'],
        credentials: true,
      })
    );
  }, []);
  useEffect(() => {
    if (token) unsubscribe(token, dispatch);
    return () => unsubscribe;
  }, [dispatch, token]);

  return (
    <Suspense
      fallback={
        <div className='loadingPage'>
          <LoadingPage />
        </div>
      }>
      <SocketContext.Provider value={socket}>
        <div className='App' id='App'>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <PrivateRoute exact path='/home' component={Home} />
            <PrivateRoute exact path='/connect' component={Connect} />
            <PrivateRoute exact path='/:username/followers' component={Connections} />
            <PrivateRoute exact path='/:username/following' component={Connections} />
            <PrivateRoute exact path='/settings' component={Settings} />
            <PrivateRoute exact path='/:username' component={Profile} />
            <PrivateRoute exact path='/:username/replies' component={Profile} />
            <PrivateRoute exact path='/:username/media' component={Profile} />
            <PrivateRoute exact path='/:username/likes' component={Profile} />
            <PrivateRoute exact path='/:username/post/:id' component={Post} />
          </Switch>
        </div>
      </SocketContext.Provider>
    </Suspense>
  );
}

export default App;
