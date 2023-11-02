import { FC, useEffect, useState, ChangeEvent } from 'react';

import styles from './styles.module.scss';

interface Props {
  label: string;
  type: string;
  min?: number;
  max?: number;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  rows?: number;
  setState: (value: any) => void;
  value?: string | number;
  counter?: boolean;
  innerText?: string;
}

const InputField: FC<Props> = ({
  label,
  type,
  min,
  max,
  required,
  placeholder,
  helperText,
  rows,
  setState,
  value,
  counter,
  innerText,
}: Props) => {
  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;

    const newTimeConverted = +(
      Number(newTime.split(':')[0]) +
      Number(newTime.split(':')[1]) / 60
    ).toFixed(2);

    if (max) {
      if (newTimeConverted <= max) {
        setState(newTime);
      } else {
        console.log('erro')
      }
    } else {
      setState(newTime);
    }
  };

  return (
    <div className={styles.field}>
      <label htmlFor={label}>
        {label} <span>{required && '*'}</span>
      </label>

      {type !== 'text' ? (
        <>
          <input
            type={type}
            id={label}
            required={required}
            max={'04:00'}
            min={min}
            placeholder={placeholder}
            onChange={
              type === 'time'
                ? handleTimeChange
                : (event) => {
                    if (type === 'number') {
                      setState(+event.target.value);
                    } else {
                      setState(event.target.value);
                    }
                  }
            }
            style={{ height: '56px' }}
            // defaultValue={value}
            value={value}
          />
          {innerText && (
            <span
              className={styles.innerText}
              style={type === 'time' ? { left: '6.4rem' } : {}}
            >
              {innerText}
            </span>
          )}
        </>
      ) : rows ? (
        <textarea
          id={label}
          required={required}
          placeholder={placeholder}
          maxLength={max}
          rows={rows}
          onChange={(event) => {
            setState(event.target.value);
          }}
          defaultValue={value}
        />
      ) : (
        <input
          type={type}
          id={label}
          required={required}
          placeholder={placeholder}
          maxLength={max}
          style={{ height: '56px' }}
          onChange={(event) => {
            setState(event.target.value);
          }}
          defaultValue={value}
        />
      )}
      <div>
        <p>{helperText}</p>
        <p>
          {counter &&
            max &&
            typeof value === 'string' &&
            `${value?.length}/${max}`}
        </p>
      </div>
    </div>
  );
};

export default InputField;
