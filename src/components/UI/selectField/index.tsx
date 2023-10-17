import { FC, useRef } from 'react';
import ArrowDown from '@public/icons/ArrowDropDownFilled.svg';

import styles from './styles.module.scss';
import Image from 'next/image';

interface Props {
  label?: string;
  required?: boolean;
  options: string[];
  onChange: (value: string) => void;
}

const SelectField: FC<Props> = ({
  label,
  required,
  options,
  onChange,
}: Props) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={label}>
          {label} <span>{required && '*'}</span>
        </label>
      )}
      <select
        id={label}
        onChange={(e) => onChange(e.target.value)}
        ref={selectRef}
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
      />
    </div>
  );
};

export default SelectField;
