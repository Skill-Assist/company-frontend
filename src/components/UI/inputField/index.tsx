import { FC } from 'react';

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
            min={min}
            placeholder={placeholder}
            onChange={(event) => {
              if (type === 'number') {
                setState(+event.target.value);
              } else {
                setState(event.target.value);
              }
            }}
            style={{ height: '56px' }}
            defaultValue={value}
          />
          {innerText && <span className={styles.innerText}>{innerText}</span>}
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
          style={{height: '56px'}}
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