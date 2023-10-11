import { ReactNode, FC, useState } from 'react';

import Header from '../header';

import styles from './styles.module.scss';
import Sidebar from '../sidebar';

type Props = {
  sidebar?: boolean;
  header?: boolean;
  headerTitle?: string;
  goBack?: boolean;
  children: ReactNode;
};

const Layout: FC<Props> = ({
  sidebar,
  header,
  headerTitle,
  goBack,
  children,
}: Props) => {
  return (
    <div className={styles.container}>
      {sidebar && <Sidebar />}

      <div className={styles.rightSection}>
        {header && (
          <Header title={headerTitle} goBack={goBack ? true : false} />
        )}
        <div
          className={`${!header ? styles.noHeader : styles.withHeader} ${
            styles.content
          }}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
