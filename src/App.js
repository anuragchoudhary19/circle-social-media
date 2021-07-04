import React, { useRef, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { unsubscribe } from './functions/user';
import PrivateRoute from './Components/Routes/PrivateRoute';
import Signup from './Pages/Auth/Signup/Signup';
import Login from './Pages/Auth/Login/Login';
import Profile from './Pages/User/Profile/Profile';
import Post from './Pages/User/StatusExpanded/StatusExpanded';
import Settings from './Pages/User/Settings';
import Connect from './Pages/User/Connect/Connect';
import Connections from './Pages/User/Connections/Connections';
import Home from './Pages/User/Home';
import './App.css';
export const SocketContext = React.createContext();

function App() {
  const { current: socket } = useRef(io('http://localhost:9000'));
  const { user } = useSelector((state) => ({ ...state }));
  const socketId = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) unsubscribe(user.token, dispatch);
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    socket.on('connect', () => {
      socketId.current = socket.id;
    });
    socket.on('reload', (id) => {
      if (id === socket.id) {
        unsubscribe(user.token, dispatch);
      }
    });
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      <div className='App' id='App'>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <PrivateRoute exact path='/home' component={Home} />
          <PrivateRoute exact path='/connect' component={Connect} />
          <PrivateRoute exact path='/followers' component={Connections} />
          <PrivateRoute exact path='/following' component={Connections} />
          <PrivateRoute exact path='/settings' component={Settings} />
          <PrivateRoute exact path='/:username' component={Profile} />
          <PrivateRoute exact path='/:username/replies' component={Profile} />
          <PrivateRoute exact path='/:username/media' component={Profile} />
          <PrivateRoute exact path='/:username/likes' component={Profile} />
          <PrivateRoute exact path='/:username/post/:id' component={Post} />
        </Switch>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
