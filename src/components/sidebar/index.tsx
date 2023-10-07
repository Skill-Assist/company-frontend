import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Logo from '@public/white_logo.svg';
import Dashboard from '@public/icons/dashboard.svg';
import Exams from '@public/icons/exams.svg';
import Suport from '@public/icons/support.svg';

import styles from './styles.module.scss';

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src={Logo} alt="Logo da plataforma" />
        <p>Skill Assist</p>
      </div>

      <ul className={styles.navigation}>
        <li>
          <Link
            href="/"
            className={`${styles.item} ${
              router.pathname === '/' && styles.active
            }`}
          >
            <div>
              <Image
                src={Dashboard}
                width={26}
                height={23}
                alt="dasboard_icon"
              />
            </div>
            <span className={styles.itemText}>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            href="/exams"
            className={`${styles.item} ${
              router.pathname === '/exams' && styles.active
            }`}
          >
            <div>
              <Image src={Exams} width={20} height={27} alt="exams_icon" />
            </div>
            <span className={styles.itemText}>Seus Testes</span>
          </Link>
        </li>
        <li>
          <Link
            href="/help"
            className={`${styles.item} ${
              router.pathname === '/help' && styles.active
            }`}
          >
            <div>
              <Image src={Suport} width={24} height={24} alt="suport_icon" />
            </div>
            <span className={styles.itemText}>Suporte</span>
          </Link>
        </li>
      </ul>


      
    </div>
  );
};

export default Sidebar;
