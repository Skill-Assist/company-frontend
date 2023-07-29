import { FC, useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import {
  AiOutlineCloseCircle,
  AiOutlinePlus,
  AiOutlineReload,
  AiOutlineSend,
} from 'react-icons/ai';
import { BiBookOpen } from 'react-icons/bi';
import { GiNotebook } from 'react-icons/gi';
import cookie from 'react-cookies';

import Layout from '@/components/layout';

import { User } from '@/types/user';
import { Candidate } from '@/types/candidate';

import examService from '@/services/examService';

import styles from './styles.module.scss';
import userService from '@/services/userService';
import { TailSpin } from 'react-loader-spinner';


const Home = () => {
  const [pageLoading, setPageLoading] = useState(true);
  // const [candidates, setCandidates] = useState<Candidate[]>([]);
  // const [tableLoading, setTableLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const fetchUser = async () => {
    const response = await userService.getProfile();
    
    if (response.status >= 200 && response.status < 300) {
      setUser(response.data);
      setPageLoading(false);
    } else {
      toast.error('Erro ao buscar usuário!');
      setPageLoading(false);
    }
  };

  const data = {
    slides: [
      {
        icon: 'automation.svg',
        id: 'automation',
        title: 'Plug-and-play',
        copy: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam.',
      },
      {
        icon: 'proctoring.svg',
        id: 'proctoring',
        title: 'Proctoring',
        copy: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam.',
      },
      {
        icon: 'plug-and-play.svg',
        id: 'plug-and-play',
        title: 'Plug-and-play',
        copy: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam.',
      },
      {
        icon: 'curva.svg',
        id: 'curva',
        title: 'Notas "na curva"',
        copy: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam.',
      },
      {
        icon: 'ai.svg',
        id: 'ai',
        title: 'Correção baseada em AI',
        copy: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam.',
      },
      {
        icon: 'rocket.svg',
        id: 'rocket',
        title: 'Escala do processo',
        copy: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam.',
      },
    ],
  };

  //////Example data/////
  // const fetchCandidates = async () => {
  //   setTableLoading(true);
  //   const response = await examService.getCandidates('1');

  //   if (response.status >= 200 && response.status < 300) {
  //     setCandidates(response.data.reverse());
  //     setTableLoading(false);
  //   } else {
  //     toast.error('Erro ao buscar candidatos!');
  //     setTableLoading(false);
  //   }
  // };
  ////////////////////////////////

  useEffect(() => {
    const showAnnouncementCookie = cookie.load(
      'show_skill_assist_announcement'
    );
    if (showAnnouncementCookie === 'false') {
      setShowAnnouncement(false);
    } else {
      setShowAnnouncement(true);
    }

    fetchUser();
    // fetchCandidates();
  }, []);

  if (pageLoading) {
    return (
      <Layout sidebar header headerTitle="Dashboard" active={0}>
        <div className={styles.loadingContainer}>
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </Layout>
    );
  }

  if(!user) {
    return (
      <Layout sidebar header headerTitle="Dashboard" active={0}>
        <div className={styles.loadingContainer}>
          <h1>Erro ao carregar usuário</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebar header headerTitle="Dashboard" active={0}>
      <div className={styles.container}>
        <div className={styles.introContainer}>
          <h1>
            Olá, <span>{user.name}</span>
          </h1>
          <h2>
            Seja muito bem vindo(a) à <span>Skill Assist</span>
          </h2>
          <div>
            <button>
              <AiOutlinePlus />
              <Link href={'/exams/create'}>Criar novo exame</Link>
            </button>
            <button
              onClick={() => {
                toast.loading('Feature em desenvolvimento', {
                  duration: 3000,
                  position: 'top-right',
                });
              }}
            >
              <BiBookOpen />
              Tutoriais
            </button>
          </div>
        </div>
        {showAnnouncement === true && (
          <div className={styles.announcementContainer}>
            <AiOutlineCloseCircle
              size={25}
              onClick={() => {
                cookie.save('show_skill_assist_announcement', 'false', {
                  domain: `${process.env.NEXT_PUBLIC_COOKIE_DOMAIN_URL}`,
                });
                setShowAnnouncement(false);
              }}
            />
            Anuncio
          </div>
        )}
        <div className={styles.featuresContainer}>
          <h2>Features</h2>
          <ul>
            {data.slides.map((slide, index) => {
              return (
                <li key={index}>
                  <Image
                    src={`/icons/features/dark/${slide.icon}`}
                    width={50}
                    height={50}
                    alt={slide.id}
                  />
                  <div>
                    <h3>{slide.title}</h3>
                    <p>{slide.copy}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        {/* <div className={styles.socialContainer}>
          <h2>Social</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <span>Nome</span>
                </th>
              </tr>
            </thead>
            {tableLoading ? (
              'Carregando...'
            ) : (
              <tbody>
                {candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td>
                        <div className={styles.userTd}>
                          <Image
                            src={candidate.logo ? candidate.logo : '/user.png'}
                            alt="avatar"
                            width={40}
                            height={40}
                          />
                          <div>
                            {candidate.name && <p>{candidate.name}</p>}
                            <span>{candidate.email}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center' }}>
                      <p style={{ color: 'var(--secondary-2)' }}>
                        Nenhum candidato encontrado
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div> */}
      </div>
    </Layout>
  );
};

export default Home;