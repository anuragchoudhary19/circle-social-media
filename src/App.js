import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useVerifyLoggedIn } from './customHooks/useVerifyLoggedIn';
import { SocketProvider } from './SocketProvider';

import LoadingPage from './Components/LoadingPage/LoadingPage';
import './App.css';
const PrivateRoute = lazy(() => import('./Components/Routes/PrivateRoute'));
const Signup = lazy(() => import('./Pages/Auth/Signup/Signup'));
const Login = lazy(() => import('./Pages/Auth/Login/Login'));
const Profile = lazy(() => import('./Pages/User/Profile/Profile'));
const SingleTweet = lazy(() => import('./Pages/User/SingleTweet/SingleTweet'));
const Settings = lazy(() => import('./Pages/User/Settings/Settings'));
const Connect = lazy(() => import('./Pages/User/Connect/Connect'));
const Connections = lazy(() => import('./Pages/User/Connections/Connections'));
const Home = lazy(() => import('./Pages/User/Home/Home'));

export const SocketContext = React.createContext();

function App() {
  const { user } = useSelector((state) => ({ ...state }));
  useVerifyLoggedIn(user?.token);

  return (
    <Suspense
      fallback={
        <div className='loadingPage'>
          <LoadingPage />
        </div>
      }>
      <SocketProvider id={user ? user._id : ''}>
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
            <PrivateRoute exact path='/:username/tweet/:id' component={SingleTweet} />
            <PrivateRoute path='/:username' component={Profile} />
          </Switch>
        </div>
      </SocketProvider>
    </Suspense>
  );
}

export default App;
