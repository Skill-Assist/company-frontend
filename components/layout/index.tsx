import React, { ReactNode, useEffect, useState } from "react";

import styles from "./styles.module.scss";
import Sidebar from "../sidebar";
import Header from "../header";
import Footer from "../footer";
import userService from "@/services/userService";

type Props = {
  active: number;
  header?: boolean;
  headerTitle?: string;
  footer?: boolean;
  sidebar?: boolean;
  disabledSidebar?: boolean;
  secondarySidebar?: boolean;
  children: ReactNode;
  user?: any;
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
}: Props) => {
  return (
    <div className={styles.container}>
      {sidebar && (
        <Sidebar
          active={active}
          secondary={secondarySidebar ? true : false}
          disabled={disabledSidebar}
        />
      )}

      <div className={styles.rightContainer}>
        {header && (
          <Header title={headerTitle} />
        )}
        <div className={styles.content}>{children}</div>
      </div>

      {footer && <Footer />}
    </div>
  );
};

export default Layout;
