import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { TailSpin } from 'react-loader-spinner';
import toast from 'react-hot-toast';

import Layout from '@/components/layout';
import SectionsContainer from '@/components/viewContainers/sectionsContainer';
import Modal from '@/components/modal';
import ExamSideBar from '@/components/sidebars/examSideBar';
import InvitationContainer from '@/components/viewContainers/invitationContainer';

import examService from '@/services/examService';

import { Exam } from '@/types/exam';

import styles from './styles.module.scss';

const dropIn = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: '0',
    opacity: 1,
  },
  exit: {
    x: '-100%',
    opacity: 0,
  },
};

const ExamPage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [examData, setExamData] = useState<Exam>();
  const [examEditingloading, setExamEditingLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSectionsPage, setShowSectionsPage] = useState(true);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);

  const router = useRouter();

  const fetchOwnExam = async () => {
    const examId = router.query.examId;

    if (examId && typeof examId === 'string') {
      const response = await examService.getOwnExam(examId);

      if (response.status >= 200 && response.status < 300) {
        setExamData(response.data);
        localStorage.setItem(
          'exameName',
          response.data.title +
            ' ' +
            response.data.subtitle +
            ' - ' +
            response.data.level || ''
        );
        setPageLoading(false);
      } else {
        toast.error('Erro ao buscar teste!');
        setPageLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOwnExam();
  }, []);

  if (pageLoading) {
    return (
      <Layout sidebar header headerTitle="Dashboard" active={2}>
        <div className="loadingContainer">
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
  } else if (!examData) {
    <Layout sidebar header headerTitle="Dashboard" active={2}>
        <div className="loadingContainer">
          Erro ao buscar teste
        </div>
      </Layout>
  } else
    return (
      <>
        <Layout
          sidebar
          sidebarClosed
          header
          headerTitle="Seu teste"
          contentClassName={styles.p0}
        >
          <div className={styles.container}>
            <div className={styles.content}>
              <nav>
                <ul className={styles.stroke}>
                  <li
                    className={showSectionsPage ? styles.active : ''}
                    onClick={() => setShowSectionsPage(true)}
                  >
                    Seções
                  </li>
                  <li
                    className={!showSectionsPage ? styles.active : ''}
                    onClick={() => setShowSectionsPage(false)}
                  >
                    Candidatos
                  </li>
                </ul>
              </nav>
              {showSectionsPage ? (
                <SectionsContainer
                  sections={examData.__sections__}
                  examDuration={examData.durationInHours}
                  examId={examData.id}
                  onCreateSection={fetchOwnExam}
                />
              ) : (
                <InvitationContainer />
              )}
            </div>

            <motion.div
              className={styles.examInfos}
              variants={dropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ExamSideBar examData={examData} open={open} />
            </motion.div>
          </div>
        </Layout>

        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {showModal && (
            <Modal
              handleClose={close}
              dimensions={{
                height: '200px',
                width: '600px',
              }}
            >
              <div className={styles.modalContainer}>
                <>
                  {examEditingloading ? (
                    <div className="loadingContainer">
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
                  ) : (
                    <>
                      <h1>Editar teste!</h1>
                    </>
                  )}
                </>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </>
    );
};

export default ExamPage;
