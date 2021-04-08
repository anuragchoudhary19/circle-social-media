import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Logo from '../Logo';
import Input from '../../../Components/Elements/Input/Input';
import Button from '../../../Components/Elements/Button/Button';

import { signup } from '../../../functions/auth';
import styles from './Signup.module.css';

const initialErrorState = { general: '', name: '', email: '', password: '', confirmPassword: '' };

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(initialErrorState);
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  useEffect(() => {
    if (user?.token) {
      history.push(`/profile/${user._id}`);
    }
  }, []);
    
  const handleName = (e) => {
    setError({ ...error, name: '' });
    setName(e.target.value);
  };
  const handleEmail = (e) => {
    setError({ ...error, email: '' });
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setError({ ...error, password: '' });
    setPassword(e.target.value);
  };
  const handlePasswordConfirm = (e) => {
    setError({ ...error, confirmPassword: '' });
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError({ ...error, password: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    signup(name, email, password)
      .then((res) => {
        console.log(res);
        if (res.data.message) {
          setError(initialErrorState);
          setMessage(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.response);
        setMessage('');
        if (err.response.data.error.param) {
          let param = err.response.data.error.param;
          let msg = err.response.data.error.msg;
          setError({ ...error, [param]: msg });
          setLoading(false);
          return;
        }
        if (err.response.data.error) {
          setError({ ...error, general: err.response.data.error });
          setLoading(false);
        }
      });
  };
  return (
    <div className={styles.page}>
      <Logo />
      <div className={styles.auth}>
        <div>
          <header>Sign Up</header>
          {error.general && <span className={styles.error}>{error.general}</span>}
          {message && <span className={styles.success}>{message}</span>}
          <Input label='Name' type='text' value={name} error={error.name} onChange={handleName} />
          <Input label='Email' type='email' value={email} error={error.email} onChange={handleEmail} />
          <Input label='Password' type='password' value={password} error={error.password} onChange={handlePassword} />
          <Input label='Confirm Password' type='password' value={confirmPassword} onChange={handlePasswordConfirm} />
          <br />
          <Button type='submit' text='Sign Up' loading={loading} onClick={handleSubmit} />
          <div className={styles.login}>
            <Link to={'/login'}>Already a User? Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
