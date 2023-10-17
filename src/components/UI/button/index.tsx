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
}: Props) => {
  return (
    <>
      {type !== 'link' && !url ? (
        <button
          className={styles.button}
          style={{
            color: fontColor,
            backgroundColor: backgroundColor,
            border: borderColor ? `1px solid ${borderColor}` : 'none',
            boxShadow: boxShadow
              ? '4px 4px 25px 0px rgba(40, 89, 67, 0.25)'
              : 'none',
            width: dimensions?.width ? dimensions.width : '164px',
            height: dimensions?.height ? dimensions.height : '41px',
          }}
          type={type}
          onClick={onClick}
        >
          {children}
        </button>
      ) : (
        <Link
          className={styles.button}
          style={{
            color: fontColor,
            backgroundColor: backgroundColor,
            borderColor: borderColor ? borderColor : backgroundColor,
            width: dimensions?.width ? dimensions.width : '164px',
            height: dimensions?.height ? dimensions.height : '41px',
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
