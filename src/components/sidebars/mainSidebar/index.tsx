import { FC } from "react";
import Link from "next/link";

import styles from "./styles.module.scss";
import Image from "next/image";

import Logo from "@public/logo.svg";
import DashboardIcon from "@public/icons/dashboard.svg";
import ExamsIcon from "@public/icons/exams.svg";
import ResultsIcon from "@public/icons/result.svg";
import SupportIcon from "@public/icons/support.svg";

type Props = {
  active: number | undefined;
  show: boolean;
  setShow: (show: boolean) => void;
};

const MainSidebar: FC<Props> = ({
  active,
  show,
  setShow,
}: Props) => {
  const navigationItems = [
    {
      icon: DashboardIcon,
      text: "Dashboard",
      url: "/",
    },
    {
      icon: ExamsIcon,
      text: "Seus Testes",
      url: "/exams",
    },
    {
      icon: ResultsIcon,
      text: "Resultados",
      url: "/results",
    },
    {
      icon: SupportIcon,
      text: "Suporte",
      url: "/help",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image
          src={Logo}
          alt="Logo da plataforma"
          onClick={() => {
            setShow(!show);
          }}
        />
      </div>

      <div className={`${styles.navigation} `}>
        {navigationItems.map((item, index) => (
              <Link
                href={item.url}
                className={`
                ${styles.item} 
                ${active === index ? styles.active : ""} 
                `}
                key={item.text}
              >
                <div className={styles.itemContainer}>
                  <Image
                    className={styles.itemIcon}
                    src={item.icon}
                    alt="Logo da plataforma"
                  />
                  <span
                    className={`${styles.itemText} ${show ? styles.open : {}}`}
                  >
                    {item.text}
                  </span>
                </div>
              </Link>
            ))}
      </div>

      <div className={`${styles.footer} ${show ? styles.openFooter : {}}`}>
        <span>
          &copy; {new Date().getFullYear()} Skill Assist | All rights reserved
        </span>
      </div>
    </div>
  );
};

export default MainSidebar;
