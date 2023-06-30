import React, { useEffect, useRef, useState } from 'react'
import cookies from 'react-cookies'

import styles from './styles.module.scss'
import Image from 'next/image';

import { BsArrowLeft } from 'react-icons/bs'
import { useRouter } from 'next/router';
import photo from 'public/images/user-photo.svg'
import Link from 'next/link';

type Props = {
  title?: string;
  user: any;
  goBack?: boolean;
}

const Header: React.FC<Props> = ({ goBack, title, user }: Props) => {
  const router = useRouter()
  const [profileOpened, setProfileOpened] = useState(false)

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setProfileOpened(false)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const logout = () => {
    cookies.remove('token')
    router.push('/login')
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const goToProfile = () => {
    setProfileOpened(false)
    router.push('/profile')
  }

  return (
    <div className={styles.header}>
      {goBack && (
        <div className={styles.backArrow} onClick={() => router.back()}>
          <BsArrowLeft width={40} height={40} />
        </div>
      )}

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.profile} onClick={() => setProfileOpened(!profileOpened)} ref={wrapperRef}>
          {
            user && (
              <>
                <span>Olá, </span>
                <span className={styles.user}>{user.name}</span>
                <Image width={0} height={0} src={user.photo ? user.photo : photo} alt='Profile Image' />
              </>
            )
          }

          {profileOpened && (
            <div className={styles.optionsContainer}>
                <div className={styles.option} onClick={() => goToProfile()}>
                  <p>Ver perfil</p>
                </div>
              <div className={styles.option} onClick={() => logout()}>
                <p>Logout</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header