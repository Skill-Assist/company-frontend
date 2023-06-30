import React, { ReactNode } from "react";

import styles from "./styles.module.scss";
import Sidebar from "../sidebar";
import Header from "../header";
import Footer from "../footer";

type Props = {
  active: number;
  header?: boolean;
  headerTitle?: string;
  footer?: boolean;
  sidebar?: boolean;
  disabledSidebar?: boolean;
  secondarySidebar?: boolean;
  children: ReactNode;
  user?: any
};

const Layout: React.FC<Props> = ({
  sidebar,
  disabledSidebar,
  header,
  headerTitle,
  footer,
  active,
  children,
  secondarySidebar,
  user
}: Props) => {
  return (
    <div className={styles.container}>
      {sidebar && <Sidebar active={active} secondary={secondarySidebar ? true : false} disabled={disabledSidebar}/>}

      {header && <Header title={headerTitle} user={user} />}
      <div className={`${styles.content} ${header && styles.mt} ${footer && styles.mb}`}>
        {children}
      </div>

      {footer && <Footer />}
    </div>
  );
};

export default Layout;
