import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { TailSpin } from 'react-loader-spinner';
import toast from 'react-hot-toast';

import Layout from '@/components/layout';
import QuestionsContainer from '@/components/viewContainers/questionsContainer';
import SectionSideBar from '@/components/sidebars/sectionSideBar';
import Modal from '@/components/modal';

import sectionService from '@/services/sectionService';

import { Section } from '@/types/section';

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

const SectionPage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [sectionData, setSectionData] = useState<Section>();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);

  const router = useRouter();

  const fetchOwnSection = async () => {
    const sectionId = router.query.sectionId;

    if (sectionId && typeof sectionId === 'string') {
      const response = await sectionService.getOwnSection(sectionId);

      if (response.status >= 200 && response.status < 300) {
        setSectionData(response.data);
        localStorage.setItem('sectionName', response.data.name || '');
        setPageLoading(false);
        return response.data; 
      } else {
        toast.error('Erro ao buscar seção!');
        setPageLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOwnSection();
  }, []);

  if (pageLoading) {
    return (
      <Layout sidebar header headerTitle="Dashboard" active={1}>
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
  } else if (!sectionData) {
    <Layout sidebar header headerTitle="Dashboard" active={2}>
      <div className="loadingContainer">Erro ao buscar teste</div>
    </Layout>;
  } else {
    return (
      <>
        <Layout
          sidebar
          sidebarClosed
          header
          goBack
          headerTitle="Seu teste"
          contentClassName={styles.p0}
        >
          <div className={styles.container}>
            <QuestionsContainer fetchOwnSection={fetchOwnSection} />
            <motion.div
              className={styles.sectionInfos}
              variants={dropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <SectionSideBar
                sectionData={sectionData}
                open={open}
                fetchOwnSection={fetchOwnSection}
              />
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
                  {loading ? (
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
                      <h1>Editar Section!</h1>
                    </>
                  )}
                </>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </>
    );
  }
};

export default SectionPage;
