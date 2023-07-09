import { FC } from "react";
import styles from "./styles.module.scss";

import CopyrightIcon from "@mui/icons-material/Copyright";

const Footer: FC = () => {
  return (
    <div className={styles.footer}>
      <CopyrightIcon className="icon" />
      <span>
        {" "}
        {new Date().getFullYear()} Skill Assist | All rights reserved
      </span>
    </div>
  );
};

export default Footer;
