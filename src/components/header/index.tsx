import { FC, useEffect, useRef, useState, RefObject } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import cookies from "react-cookies";

import { BsPersonCircle } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";

import styles from "./styles.module.scss";
import { User } from "@/types/user";
import userService from "@/services/userService";

type Props = {
  title?: string;
  goBack?: boolean;
};

const Header: FC<Props> = ({ goBack, title }: Props) => {
  const router = useRouter();
  const [isDropdownlOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User>();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem("skillAssistUser");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const logout = () => {
    userService.logout();
  };

  const useOutsideAlerter = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        {goBack && (
          <BsArrowLeft
            onClick={() => router.back()}
            size={36}
            fill="var(--primary)"
          />
        )}
        <h2>{title}</h2>
      </div>

      <div className={styles.profile} ref={wrapperRef}>
        {user && (
          <div className={styles.headerInfo}>
            <p>Olá, </p>
            <span>{user.name.split(" ")[0]}</span>

            <div
              className={styles.userIcon}
              onClick={() => setIsDropdownOpen((prevState) => !prevState)}
            >
              <Image
                width={200}
                height={200}
                src={user.logo}
                alt="Profile Image"
              />
            </div>
            <div
              className={`${styles.dropdownMenu} ${
                isDropdownlOpen ? styles.open : styles.closed
              }`}
              ref={menuRef}
            >
              <ul>
                <li className={styles.dropdownItem}>
                  <BsPersonCircle size={25} />
                  <Link href="/profile">Ver Perfil</Link>
                </li>
                <li className={styles.dropdownItem}>
                  <BiLogOut size={25} />
                  <Link onClick={logout} href="#">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
