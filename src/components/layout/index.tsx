import { ReactNode, FC, useState } from "react";

import Sidebar from "../sidebar";
import Header from "../header";

import styles from "./styles.module.scss";

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
  sidebarClosed,
  active,
  header,
  headerTitle,
  goBack,
  children,
  contentClassName
}: Props) => {
  const [show, setShow] = useState(sidebarClosed ? false : true);

  return (
    <div className={styles.container}>
      {sidebar && (
        <Sidebar
          active={active}
          show={show}
          setShow={setShow}
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
