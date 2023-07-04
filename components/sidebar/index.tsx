import React, { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./styles.module.scss";
import Image from "next/image";

import Logo from "public/images/logo.svg";
import HomeIcon from "public/icons/home.svg";
import ExamsIcon from "public/icons/exams.svg";
import ResultsIcon from "public/icons/trophy.svg";
import SupportIcon from "public/icons/support.svg";
import DownIcon from "public/icons/down-icon.svg";
import QuestionsIcon from "public/icons/questions.svg";
import RolesIcon from "public/icons/roles.svg";

type Props = {
  active: number;
  secondary?: boolean;
  disabled?: boolean
};

type NavigationItems = {
  icon: any;
  text: string;
  url: string;
  opened?: boolean;
  subItems?: any;
  disabled?: boolean
};

const Sidebar: React.FC<Props> = ({ active, secondary, disabled }: Props) => {
  const defaultNavigationItems = secondary
    ? [
      {
        icon: QuestionsIcon,
        text: "Questões",
        url: "#",
      },
      {
        icon: RolesIcon,
        text: "Regras",
        url: "#",
      },
    ]
    : [
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
        icon: ResultsIcon,
        text: "Criar Teste",
        url: "/create"
      },
      {
        icon: ResultsIcon,
        text: "Resultados",
        url: "/results",
        disabled: true
      },
      {
        icon: SupportIcon,
        text: "Suporte",
        url: "/help",
        disabled: true
      },
    ];

  const [navigationItems, setNavigationItems] = useState<NavigationItems[]>(
    defaultNavigationItems
  );

  const openSubItems = (index: number) => {
    let newItems = [...navigationItems];
    newItems[index].opened = !newItems[index].opened;

    setNavigationItems(newItems);
  };

  useEffect(() => {
    console.log(navigationItems);
  }, [navigationItems]);

  return (
    <div className={styles.container}>
      <Image className={styles.logo} src={Logo} alt="Logo da plataforma" />

      <div className={styles.navigation}>
        {navigationItems.map((item, index) =>
          active === index && item.subItems ? (
            <div
              className={`${styles.item} ${active === index && styles.active}`}
              key={item.text}
              onClick={() => openSubItems(index)}
            >
              <div className={styles.itemContainer}>
                <Image
                  loading="lazy"
                  className={styles.itemIcon}
                  src={item.icon}
                  alt="Logo da plat aforma"
                />
                <span className={styles.itemText}>{item.text}</span>
              </div>
              {item.subItems && (
                <div
                  className={item.opened ? styles.upArrow : styles.downArrow}
                >
                  <Image loading="lazy" src={DownIcon} alt="Down arrow icon" />
                </div>
              )}
            </div>
          ) : (
            <Link
              href={!disabled ? item.url : '#'}
              className={`${styles.item} ${active === index ? styles.active : ''} ${item.disabled ? styles.disabled : ''} ${disabled ? styles.disabled : ''}`}
              key={item.text}
            >
              <div className={`${styles.itemContainer}`}>
                <Image
                  loading="lazy"
                  className={styles.itemIcon}
                  src={item.icon}
                  alt="Logo da plataforma"
                />
                <span className={styles.itemText}>{item.text}</span>
              </div>
              {item.subItems && (
                <div
                  className={item.opened ? styles.upArrow : styles.downArrow}
                >
                  <Image loading="lazy" src={DownIcon} alt="Down arrow icon" />
                </div>
              )}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
