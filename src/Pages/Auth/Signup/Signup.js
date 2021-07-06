import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Logo from '../../../Components/Logo/Logo';
import Input from '../../../Components/Elements/Input/Input';
import Button from '../../../Components/Elements/Button/Button';

import { signup } from '../../../functions/auth';
import styles from './Signup.module.css';

const initialState = { username: '', email: '', password: '', confirmPassword: '' };

const Signup = () => {
  const [form, setForm] = useState(initialState);
  let { username, email, password, confirmPassword } = form;
  const [error, setError] = useState({ ...initialState, general: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();

  useEffect(() => {
    if (user?.token) {
      history.push(`/profile/${user._id}`);
    }
  }, []);

  const handleChange = (label) => (e) => {
    console.log(e.target.value);
    setError({ ...error, [label]: '' });
    setForm({ ...form, [label]: e.target.value });
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError({ ...error, password: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    signup(username, email, password)
      .then((res) => {
        if (res.data.message) {
          setLoading(false);
          setForm(initialState);
          setError(initialState);
          setMessage(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        setMessage('');
        if (err.response.data) {
          let param = err.response.data.param;
          let msg = err.response.data.msg;
          setError({ ...error, [param]: msg });
          setLoading(false);
          return;
        }
        if (err.response.data) {
          setError({ ...error, general: err.response.data });
          setLoading(false);
        }
      });
  };
  return (
    <div className={styles.page}>
      <Logo />
      <div className={styles.signup}>
        <div>
          <header>Sign Up</header>
          {error.general && <div className={styles.error}>{error.general}</div>}
          {message && <div className={styles.success}>{message}</div>}
          <Input
            label='Username'
            type='text'
            value={username}
            error={error.username}
            onChange={handleChange('username')}
          />
          <Input label='Email' type='email' value={email} error={error.email} onChange={handleChange('email')} />
          <Input
            label='Password'
            type='password'
            value={password}
            error={error.password}
            onChange={handleChange('password')}
          />
          <Input
            label='Confirm Password'
            type='password'
            value={confirmPassword}
            onChange={handleChange('confirmPassword')}
          />
          <br />
          <Button type='submit' text='Sign Up' loading={loading} onClick={handleSubmit} />
          <div className={styles.login}>
            <Link to={'/login'}>Have an account? Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
