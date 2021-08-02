import React, { useRef, useEffect, useState } from 'react';
import styles from './TextArea.module.css';

const TextArea = (props) => {
  const textarea = useRef();
  useEffect(() => {
    textarea.current.style.height = 'fit-content';
    textarea.current.style.height = `${textarea.current.scrollHeight}px`;
  }, [props.value]);
  return (
    <div className={styles.textarea}>
      <textarea
        rows={props.rows}
        ref={textarea}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </div>
  );
};

export default TextArea;
