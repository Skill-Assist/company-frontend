import React, { ReactNode } from "react";

import styles from "./styles.module.scss";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";

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
