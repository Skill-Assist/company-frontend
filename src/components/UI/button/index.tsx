import { FC, ReactNode } from 'react';

import styles from './styles.module.scss';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  type: 'button' | 'submit' | 'link';
  onClick?: () => void;
  url?: string;
  fontColor: string;
  backgroundColor: string;
  borderColor?: string;
  boxShadow?: boolean;
  dimensions?: {
    width: string;
    height: string;
  };
  fontSize?: string;
  fontWeight?: string;
  disabled?: boolean;
};

const Button: FC<Props> = ({
  children,
  type,
  onClick,
  url,
  backgroundColor,
  fontColor,
  borderColor,
  boxShadow,
  dimensions,
  fontSize,
  fontWeight,
  disabled,
}: Props) => {
  return (
    <>
      {type !== 'link' && !url ? (
        <button
          className={styles.button}
          style={{
            color: fontColor,
            backgroundColor: backgroundColor,
            border: borderColor ? `.1rem solid ${borderColor}` : 'none',
            boxShadow: boxShadow
              ? '.4rem .4rem 2.5rem 0rem rgba(40, 89, 67, 0.25)'
              : 'none',
            width: dimensions?.width ? dimensions.width : '16.4rem',
            height: dimensions?.height ? dimensions.height : '4.1rem',
            fontSize: fontSize ? fontSize : '1.6rem',
            fontWeight: fontWeight ? fontWeight : '600',
          }}

          type={type}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      ) : (
        <Link
          className={styles.button}
          style={{
            color: fontColor,
            backgroundColor: backgroundColor,
            width: dimensions?.width ? dimensions.width : '16.4rem',
            height: dimensions?.height ? dimensions.height : '4.1rem',
            border: borderColor ? `.1rem solid ${borderColor}` : 'none',
            boxShadow: boxShadow
              ? '.4rem .4rem 2.5rem 0rem rgba(40, 89, 67, 0.25)'
              : 'none',
            fontSize: fontSize ? fontSize : '1.6rem',
            fontWeight: fontWeight ? fontWeight : '600',
          }}
          href={url ? url : '#'}
        >
          {children}
        </Link>
      )}
    </>
  );
};

export default Button;
