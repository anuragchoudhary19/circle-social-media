import React from 'react'
import styles from './Button.module.css'
const Button = (props) => {
    return (
        <div className={styles.element} onClick={props.onClick}>
            <div className={styles.button}>
                {props.loading && <div className={styles.spinner}></div>}
                <button type={props.type} >{props.text}</button>
            </div>
        </div>
    )
}

export default Button
