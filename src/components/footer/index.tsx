import { FC } from "react";
import styles from "./styles.module.scss";

const Footer: FC = () => {
  return (
    <div className={styles.footer}>
      <span>
          &copy; {new Date().getFullYear()} Skill Assist | All rights reserved
        </span>
    </div>
  );
};

export default Footer;
