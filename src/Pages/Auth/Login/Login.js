import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { animatiion } from './Canvas';
//
import Logo from '../../../Components/Logo/Logo';
import Input from '../../../Components/Elements/Input/Input';
import Button from '../../../Components/Elements/Button/Button';
//
import { signin } from '../../../functions/auth';
import styles from './Login.module.css';
import styles1 from './Canvas.module.css';

const Login = () => {
  const dummyEmail = 'anurag@gmail.com';
  const dummyPassword = 'password123';
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dummyLoading, setDummyLoading] = useState(false);
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
  }, [history, user]);
  useEffect(() => {
    animatiion();
  }, []);
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
    setLoginError('');
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
      })
      .then(() => {
        history.push(`/home`);
      })
      .catch((err) => {
        setLoading(false);
        setLoginError(err.response?.data.error);
      });
  };

  const handleDummySignin = () => {
    setDummyLoading(true);
    setMessage('');
    setLoginError('');
    signin(dummyEmail, dummyPassword)
      .then((res) => {
        setDummyLoading(false);
        if (window !== undefined) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: res.data.user,
        });
      })
      .then(() => {
        history.push(`/home`);
      })
      .catch((err) => {
        setDummyLoading(false);
        setLoginError(err.response?.data.error);
      });
  };
  return (
    <div className={styles.page}>
      <canvas className={styles1.canvas} id='canvas1'></canvas>
      <Logo />
      <div className={styles.auth}>
        <div>
          <header>
            <h2>Sign In</h2>
          </header>
          {loginError && <div className={styles.error}>{loginError}</div>}
          {message && <div className={styles.success}>{message}</div>}
          <Input label='Email' type='email' value={email} error={emailError} onChange={handleEmail} autoFocus={true} />
          <Input label='Password' type='password' value={password} error={passwordError} onChange={handlePassword} />
          <br />
          <Button btnStyle='primaryOutline' btnSize='md' loading={loading} onClick={handleSubmit}>
            Sign In
          </Button>
          <br />
          <Button btnStyle='primaryOutline' btnSize='md' loading={dummyLoading} onClick={handleDummySignin}>
            Dummy Sign In
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
