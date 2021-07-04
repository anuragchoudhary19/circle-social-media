import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  return user?.token ? <Route {...rest} /> : <Redirect to='/' />;
};

export default PrivateRoute;
