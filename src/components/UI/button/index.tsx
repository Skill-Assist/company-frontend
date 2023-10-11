import { FC, ReactNode } from 'react';

import styles from './styles.module.scss';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  type: 'button' | 'submit' | 'link';
  url?: string;
};

const Button: FC<Props> = ({ children, type, url }: Props) => {
  return (
    <div className={styles.container}>
      {type !== 'link' && !url ? (
        <button type={type}>{children}</button>
      ) : (
        <Link href={url ? url : '#'}>{children}</Link>
      )}
    </div>
  );
};

export default Button;
