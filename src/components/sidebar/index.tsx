import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Logo from '@public/white_logo.svg';
import Dashboard from '@public/icons/fa/dashboard.svg';
import Exams from '@public/icons/fa/exams.svg';
import Suport from '@public/icons/fa/support.svg';
import ActiveDashboard from '@public/icons/fa/activeDashboard.svg';
import ActiveExams from '@public/icons/fa/activeExams.svg';
import ActiveSuport from '@public/icons/fa/activeSupport.svg';

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
                src={router.pathname === '/' ? ActiveDashboard : Dashboard}
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
              router.pathname.includes('/exams') && styles.active
            }`}
          >
            <div>
              <Image
                src={router.pathname.includes('/exams') ? ActiveExams : Exams}
                width={20}
                height={27}
                alt="exams_icon"
              />
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
              <Image
                src={router.pathname === '/help' ? ActiveSuport : Suport}
                width={24}
                height={24}
                alt="suport_icon"
              />
            </div>
            <span className={styles.itemText}>Suporte</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
