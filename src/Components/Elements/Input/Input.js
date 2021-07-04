import React from 'react';
import styles from './Input.module.css';
const Input = (props) => {
  let { error } = props;
  return (
    <div className={styles.element}>
      {props.label && <label>{props.label}</label>}
      <div className={styles.input}>
        <input
          type={props.type}
          value={props.value || ''}
          onChange={props.onChange}
          autoComplete='true'
          placeholder={props.placeholder}
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
