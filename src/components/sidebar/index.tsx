import { FC } from "react";
import Link from "next/link";

import styles from "./styles.module.scss";
import Image from "next/image";

import Logo from "public/images/logo.svg";
import HomeIcon from "public/icons/home.svg";
import ExamsIcon from "public/icons/exams.svg";
import InviteIcon from "public/icons/invite.svg";
import ResultsIcon from "public/icons/trophy.svg";
import SupportIcon from "public/icons/support.svg";

type Props = {
  active: number;
  show: boolean;
  setShow: (show: boolean) => void;
};

const Sidebar: FC<Props> = ({
  active,
  show,
  setShow,
}: Props) => {
  const navigationItems = [
    {
      icon: HomeIcon,
      text: "Home",
      url: "/",
    },
    {
      icon: ExamsIcon,
      text: "Seus Testes",
      url: "/exams",
    },
    {
      icon: InviteIcon,
      text: "Seus Convites",
      url: "/invites",
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

export default Sidebar;
