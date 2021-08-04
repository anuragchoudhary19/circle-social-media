import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
//
import Logo from '../../../Components/Logo/Logo';
import Input from '../../../Components/Elements/Input/Input';
import Button from '../../../Components/Elements/Button/Button';
//
import { signin } from '../../../functions/auth';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (user?.token) {
      history.push('/home');
    } else {
      history.push('/');
    }
  }, [history, user.token]);
  const handleEmail = (e) => {
    setEmailError('');
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPasswordError('');
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (!email) return setEmailError('Email is required');
    if (!password) return setPasswordError('Password is required');
    setLoading(true);
    setMessage('');
    setError('');
    signin(email, password)
      .then((res) => {
        setLoading(false);
        if (window !== undefined) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: res.data.user,
        });
        history.push(`/home`);
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
        setError(err.response?.data.error);
      });
  };
  return (
    <div className={styles.page}>
      <Logo />
      <div className={styles.auth}>
        <div>
          <header>
            <h2>Sign In</h2>
          </header>
          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.success}>{message}</div>}
          <Input label='Email' type='email' value={email} error={emailError} onChange={handleEmail} />
          <Input label='Password' type='password' value={password} error={passwordError} onChange={handlePassword} />
          <br />
          <Button btnStyle='primaryOutline' btnSize='md' loading={loading} onClick={handleSubmit}>
            Sign In
          </Button>
          <div className={styles.signinLink}>
            <Link to={'/signup'}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
