import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Logo from '../Logo';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError({ ...error, password: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    signup(username, email, password)
      .then((res) => {
        console.log(res);
        if (res.data.message) {
          setError(initialState);
          setMessage(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.response);
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
        <header>Sign Up</header>
        <form>
          {error.general && <span className={styles.error}>{error.general}</span>}
          {message && <span className={styles.success}>{message}</span>}
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
        </form>
        <Link className={styles.login} to={'/login'}>
          Have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
