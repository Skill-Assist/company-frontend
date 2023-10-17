import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TailSpin } from 'react-loader-spinner';
import toast from 'react-hot-toast';

import { useReadableDuration } from '@/hooks/readableDuration';
import { AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

import Modal from '@/components/modal';
import Layout from '@/components/layout';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import warning from '@public/lottie/warning.json';

import examService from '@/services/examService';

import { Exam } from '@/types/exam';

import styles from './styles.module.scss';
import Button from '@/components/UI/button';
import { CircularProgress } from '@mui/material';

const ExamPage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [examData, setExamData] = useState<Exam>();
  const [showSectionsPage, setShowSectionsPage] = useState(true);

  const [open, setOpen] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<{
    open: boolean;
    content: 'deleteExam' | '';
  }>({
    open: false,
    content: '',
  });

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

  const deleteHandler = async () => {
    setDeleteLoading(true);
    const examId = router.query.examId;

    if (examId && typeof examId === 'string') {
      const response = await examService.deleteExam(examId);

      if (response.status >= 200 && response.status < 300) {
        toast.success('Teste excluído com sucesso!');
        console.log(response);
        router.push('/exams');
      } else {
        toast.error('Erro ao excluir teste!');
        setDeleteLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOwnExam();
  }, []);

  if (pageLoading) {
    return (
      <Layout sidebar header goBack>
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
    <Layout sidebar header goBack>
      <div className="loadingContainer">Erro ao buscar teste</div>
    </Layout>;
  } else {
    const readableDuration = useReadableDuration(examData?.durationInHours);

    return (
      <>
        <Layout sidebar header goBack>
          <div className={styles.container}>
            <header>
              <h1>
                Teste <span>"{examData.jobTitle}"</span>
              </h1>
              <div className={`${styles.examInfo} ${open ? styles.open : ''}`}>
                <div className={styles.firstRow}>
                  <ul>
                    <li>
                      Nível da vaga: <span>{examData.jobLevel}</span>
                    </li>
                    <li>
                      Duração do teste: <span>{readableDuration}</span>
                    </li>
                    <li>
                      Prazo de envio:{' '}
                      <span>
                        {examData.submissionInHours / 24} dia
                        {examData.submissionInHours / 24 > 1 && 's'}
                      </span>
                    </li>
                  </ul>
                  <button>Ola</button>
                </div>
                <div className={styles.secondRow}>
                  <ul>
                    <li>
                      {examData.showScore ? (
                        <CheckRoundedIcon style={{ color: '#829CE4' }} />
                      ) : (
                        <CloseRoundedIcon
                          style={{ color: 'rgba(255, 69, 69, 0.7)' }}
                        />
                      )}{' '}
                      O candidato receberá feedback do teste.
                    </li>
                    <li>
                      {examData.isPublic ? (
                        <CheckRoundedIcon style={{ color: '#829CE4' }} />
                      ) : (
                        <CloseRoundedIcon
                          style={{ color: 'rgba(255, 69, 69, 0.7)' }}
                        />
                      )}{' '}
                      O teste não será adicionado ao banco de testes.
                    </li>
                  </ul>
                  <div>
                    <p>Descrição do teste:</p>
                    <span>
                      {examData.description ? (
                        `"${examData.description}"`
                      ) : (
                        <i>Pendente</i>
                      )}
                    </span>
                  </div>
                </div>
                <div className={styles.buttonsRow}>
                  <Button
                    type="button"
                    backgroundColor="var(--warning)"
                    fontColor="var(--neutral-0)"
                    onClick={() =>
                      setModalOptions({ open: true, content: 'deleteExam' })
                    }
                    dimensions={{ width: '125px', height: ' 41px' }}
                  >
                    Excluir teste
                  </Button>
                  <Button
                    type="link"
                    backgroundColor="var(--primary-4)"
                    fontColor="var(--neutral-0)"
                    url={`/edit/${examData.id}`}
                    dimensions={{ width: '106px', height: ' 41px' }}
                  >
                    Editar
                  </Button>
                </div>
                <div className={styles.arrowIconBx}>
                  {open ? (
                    <KeyboardArrowDownRoundedIcon
                      onClick={() => setOpen((open) => !open)}
                    />
                  ) : (
                    <KeyboardArrowUpRoundedIcon
                      onClick={() => setOpen((open) => !open)}
                    />
                  )}
                </div>
              </div>
            </header>
            {/* <div>
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
            </div> */}
          </div>
        </Layout>
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {modalOptions.open && (
            <Modal
              handleClose={close}
              dimensions={{
                width: '744px',
                height: '476px',
              }}
              sidebarOn
            >
              {modalOptions.content === 'deleteExam' &&
                (deleteLoading ? (
                  <div className="loadingContainer">
                    <CircularProgress style={{ color: 'var(--primary)' }} />
                  </div>
                ) : (
                  <div className={styles.modalContent}>
                    <div className={styles.lottie}>
                      <Lottie animationData={warning} />
                    </div>
                    <h1>
                      Você realmente deseja excluir o teste “{examData.jobTitle}
                      ”?
                    </h1>
                    <p>
                      Ao excluir o teste, ele será permanentemente removido da
                      plataforma.
                    </p>
                    <div>
                      <Button
                        type="button"
                        backgroundColor="transparent"
                        fontColor="var(--secondary-2)"
                        borderColor="var(--secondary-2)"
                        onClick={() =>
                          setModalOptions({ open: false, content: '' })
                        }
                        boxShadow={false}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        backgroundColor="var(--warning)"
                        fontColor="var(--neutral-0)"
                        onClick={deleteHandler}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
            </Modal>
          )}
        </AnimatePresence>
      </>
    );
  }
};

export default ExamPage;
