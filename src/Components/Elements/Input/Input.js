import React from 'react';
import styles from './Input.module.css';

const Input = (props) => {
  let { error, label, type, value, onChange, placeholder, autoFocus } = props;
  return (
    <div className={styles.element}>
      {label && <label>{label}</label>}
      <div className={styles.input}>
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          autoComplete='true'
          placeholder={placeholder}
          autoFocus={autoFocus || false}
        />
      </div>
      {error && (
        <div className={styles.error}>
          <span>{`* ${error}`}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
