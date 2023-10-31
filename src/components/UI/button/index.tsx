import { FC, ReactNode } from 'react';
import Link from 'next/link';

import styles from './styles.module.scss';

type Props = {
  children: ReactNode;
  type: 'button' | 'submit' | 'link';
  onClick?: () => void;
  url?: string;
  dimensions?: {
    width: string;
    height: string;
  };
  disabled?: boolean;
  actionType:
    | 'confirm'
    | 'cancel'
    | 'delete'
    | 'edit'
    | 'action1'
    | 'action2'
    | 'action3'
    | 'action4';
  form?: string;
};

const Button: FC<Props> = ({
  children,
  type,
  onClick,
  url,
  dimensions,
  disabled,
  actionType,
  form,
}: Props) => {
  const actionClass = styles[actionType];

  return (
    <>
      {type !== 'link' && !url ? (
        
        <button
          className={`${styles.button} ${actionClass}`}
          style={{
            width: dimensions?.width ? dimensions.width : '16.4rem',
            height: dimensions?.height ? dimensions.height : '4.1rem',
          }}
          type={type}
          onClick={onClick}
          disabled={disabled}
          form={form ? form : ''}
        >
          {children}
        </button>
      ) : (
        <Link
          className={`${styles.button} ${actionClass}`}
          style={{
            width: dimensions?.width ? dimensions.width : '16.4rem',
            height: dimensions?.height ? dimensions.height : '4.1rem',
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
