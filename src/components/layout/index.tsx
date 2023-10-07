import { ReactNode, FC, useState } from "react";

import Header from "../header";

import styles from "./styles.module.scss";
import Sidebar from "../sidebar";

type Props = {
  sidebar?: boolean;
  sidebarClosed?: boolean;
  active?: number;
  header?: boolean;
  headerTitle?: string;
  goBack?: boolean;
  children: ReactNode;
  contentClassName?: string;
};

const Layout: FC<Props> = ({
  sidebar,
  active,
  header,
  headerTitle,
  goBack,
  children,
  contentClassName
}: Props) => {

  return (
    <div className={styles.container}>
      {sidebar && (
        <Sidebar
          active={active}
        />
      )}

      <div className={styles.rightContainer}>
        {header && (
          <Header title={headerTitle} goBack={goBack ? true : false} />
        )}
        <div
          className={`${!header ? styles.noHeader : styles.withHeader} ${
            styles.content
          } ${contentClassName ? contentClassName : {}}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
