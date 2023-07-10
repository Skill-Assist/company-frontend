import React, { FC } from 'react'
import styles from './styles.module.scss'

interface Button {
  text: string;
  type: "button" | "submit" | 'cancel';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: FC<Button> = ({ text, type, onClick, disabled, className }: Button) => {
  return (
    <button
      className={`${styles.button} ${styles[type]} ${className && styles[className]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button