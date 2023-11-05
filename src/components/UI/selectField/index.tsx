import { FC, useRef } from 'react';
import ArrowDown from '@public/icons/ArrowDropDownFilled.svg';

import styles from './styles.module.scss';
import Image from 'next/image';

interface Props {
  label?: string;
  required?: boolean;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
  labelBgColor?: string;
}

const SelectField: FC<Props> = ({
  label,
  required,
  value,
  options,
  onChange,
  labelBgColor,
}: Props) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  return (
    <div className={styles.field}>
      {label && (
        <label
          htmlFor={label}
          style={labelBgColor ? { background: labelBgColor } : {}}
        >
          {label} <span>{required && '*'}</span>
        </label>
      )}
      <select
        id={label}
        onChange={(e) => onChange(e.target.value)}
        ref={selectRef}
        value={value}
      >
        <option value="">Selecionar</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Image
        onClick={() => {
          if (selectRef.current) {
            selectRef.current.click();
          }
        }}
        className={styles.icon}
        src={ArrowDown}
        height={34}
        width={34}
        alt="arrowDownIcon"
        style={label ? { top: '3.3rem' } : { top: '1.5rem' }}
      />
    </div>
  );
};

export default SelectField;
