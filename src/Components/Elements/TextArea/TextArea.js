import React from 'react';
import styles from './TextArea.module.css';

const TextArea = (props) => {
  const textarea = React.createRef();
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