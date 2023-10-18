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
            border: borderColor ? `1px solid ${borderColor}` : 'none',
            boxShadow: boxShadow
              ? '4px 4px 25px 0px rgba(40, 89, 67, 0.25)'
              : 'none',
            width: dimensions?.width ? dimensions.width : '164px',
            height: dimensions?.height ? dimensions.height : '41px',
            fontSize: fontSize ? fontSize : '16px',
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
            width: dimensions?.width ? dimensions.width : '164px',
            height: dimensions?.height ? dimensions.height : '41px',
            border: borderColor ? `1px solid ${borderColor}` : 'none',
            boxShadow: boxShadow
              ? '4px 4px 25px 0px rgba(40, 89, 67, 0.25)'
              : 'none',
            fontSize: fontSize ? fontSize : '16px',
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
