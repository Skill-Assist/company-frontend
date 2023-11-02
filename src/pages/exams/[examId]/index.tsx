import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TailSpin } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

import Modal from '@/components/modal';
import Layout from '@/components/layout';
import Button from '@/components/UI/button';
import InvitationContainer from '@/components/viewContainers/invitationContainer';
import SectionsContainer from '@/components/viewContainers/sectionsContainer';

import { CircularProgress } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import warning from '@public/lottie/warning.json';

import examService from '@/services/examService';

import { Exam } from '@/types/exam';

import styles from './styles.module.scss';
import ExamHeader from '@/components/examHeader';

const ExamPage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [switchStatusLoading, setSwitchStatusLoading] = useState(false);
  const [examData, setExamData] = useState<Exam>();
  const [showSectionsPage, setShowSectionsPage] = useState(true);
  const [isAgree, setIsAgree] = useState(false);
  
  const [isArchivable, setIsArchivable] = useState<number>();

  const [headerOpen, setHeaderOpen] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [switchStatusModal, setSwitchStatusModal] = useState(false);

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
        router.push('/exams');
      } else {
        toast.error('Erro ao excluir teste!');
        setDeleteLoading(false);
      }
    }
  };

  const checkIfArchivableHandler = async () => {
    const examId = router.query.examId;

    if (examId && typeof examId === 'string') {
      const response = await examService.checkIfArchivable(examId);

      if (response.status >= 200 && response.status < 300) {
        setIsArchivable(response.data.daysRemaining);
        setSwitchStatusModal(true);
      } else {
        toast.error('Erro verificar se o teste pode ser arquivado!');
        setDeleteLoading(false);
      }
    }
  };

  const switchStatus = async () => {
    setSwitchStatusLoading(true);
    const examId = router.query.examId;

    if (examId && typeof examId === 'string') {
      const status =
        examData?.status === 'draft'
          ? 'published'
          : examData?.status === 'published'
          ? 'archived'
          : 'published';

      const response = await examService.switchStatus(examId, status);

      if (response.status >= 200 && response.status < 300) {
        toast.success('Status alterado com sucesso!');
        fetchOwnExam();
        setSwitchStatusModal(false);
        setIsAgree(false);
      } else {
        toast.error('Erro ao mudar status do teste!');
        setIsAgree(false);
      }
    }
  };

  useEffect(() => {
    fetchOwnExam();
  }, []);

  // const [data, setData] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async (count: number) => {
  //     try {
  //       const response = await fetch('http://127.0.0.1:80/api/v1/health');
  //       if (response.ok) {
  //         const jsonData = await response.json();
  //         setData((prevData) => [...prevData, jsonData]);
  //         console.log('data', data);
  //         console.log('jsonData', jsonData);
  //       } else {
  //         console.error('Erro na chamada da API');
  //       }
  //     } catch (error) {
  //       console.error('Erro na chamada da API', error);
  //     }

  //     if (count < 10) {
  //       // Chama a próxima chamada após um atraso (por exemplo, 1000 ms)
  //       setTimeout(() => fetchData(count + 1), 1000);
  //     } else {
  //       // Todas as chamadas à API foram concluídas
  //       setIsLoading(false);
  //     }
  //   };

  //   // Inicia a primeira chamada à API
  //   fetchData(1);
  // }, []);

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
    return (
      <>
        <Layout sidebar header goBack>
          <div className={styles.container}>
            <ExamHeader
              checkIfArchivableHandler={checkIfArchivableHandler}
              examData={examData}
              headerOpen={headerOpen}
              setHeaderOpen={setHeaderOpen}
              setShowDeleteModal={setShowDeleteModal}
            />
            <>
              <nav>
                <ul className={styles.stroke}>
                  <li onClick={() => setShowSectionsPage(true)}>
                    Seções do teste
                  </li>
                  <li onClick={() => setShowSectionsPage(false)}>Candidatos</li>
                  <li
                    className={
                      showSectionsPage
                        ? styles.sectionActive
                        : styles.candidateActive
                    }
                  ></li>
                </ul>
              </nav>
              {showSectionsPage ? (
                <SectionsContainer
                  sections={examData.__sections__}
                  examDuration={examData.durationInHours}
                  examId={examData.id}
                  onCreateSection={fetchOwnExam}
                  headerOpen={headerOpen}
                />
              ) : (
                <InvitationContainer />
              )}
            </>
          </div>
        </Layout>
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {showDeleteModal && (
            <Modal
              handleClose={() => setShowDeleteModal(false)}
              dimensions={{
                width: '744px',
                height: '476px',
              }}
              sidebarOn
            >
              {deleteLoading ? (
                <div className="loadingContainer">
                  <CircularProgress style={{ color: 'var(--verde-1)' }} />
                </div>
              ) : (
                <div className={styles.deleteModalContent}>
                  <div className={styles.lottie}>
                    <Lottie animationData={warning} loop={false} />
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
                      actionType="cancel"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      actionType="delete"
                      onClick={deleteHandler}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              )}
            </Modal>
          )}
          {switchStatusModal && (
            <Modal
              handleClose={() => setSwitchStatusModal(false)}
              dimensions={{
                width: '588px',
                height: 'auto',
              }}
              sidebarOn
            >
              {switchStatusLoading ? (
                <div className="loadingContainer">
                  <CircularProgress style={{ color: 'var(--verde-1)' }} />
                </div>
              ) : (
                <div className={styles.switchStatusModalContent}>
                  <h1>Alteração de status do teste</h1>
                  <p className={styles.status}>
                    Status atual:{' '}
                    <span>
                      {examData.status === 'draft'
                        ? 'Rascunho'
                        : examData.status === 'published'
                        ? 'Publicado'
                        : 'Arquivado'}
                    </span>
                  </p>
                  <p className={styles.secondLine}>
                    Ao alterar o status do teste para{' '}
                    <span>
                      {examData.status === 'draft'
                        ? 'Publicado'
                        : examData.status === 'published'
                        ? 'Arquivado'
                        : 'Publicado'}
                    </span>
                    , <br />
                    as seguintes mudanças serão aplicadas:
                  </p>
                  <div className={styles.changes}>
                    {examData.status === 'draft' && (
                      <ul>
                        <li>
                          <CheckRoundedIcon
                            style={{ color: 'var(--azul-1)' }}
                          />
                          <p>
                            Você poderá <span> convidar candidatos</span> para o
                            teste.
                          </p>
                        </li>
                        <li>
                          <CheckRoundedIcon
                            style={{ color: 'var(--azul-1)' }}
                          />
                          <p>
                            Os candidatos já poderão{' '}
                            <span> realizar o teste</span>.
                          </p>
                        </li>
                        <li>
                          <CloseRoundedIcon
                            style={{ color: 'var(--vermelho-1)', opacity: 0.7 }}
                          />
                          <p>
                            Não será mais possível
                            <span>editar</span>
                            ou
                            <span>excluir</span>o teste.
                          </p>
                        </li>
                        <li>
                          <CloseRoundedIcon
                            style={{ color: 'var(--vermelho-1)', opacity: 0.7 }}
                          />
                          <p>
                            Não será possível retornar ao status
                            <span> Rascunho</span>.
                          </p>
                        </li>
                      </ul>
                    )}
                    {examData.status === 'published' && (
                      <ul>
                        <li>
                          <CloseRoundedIcon
                            style={{ color: 'var(--vermelho-1)', opacity: 0.7 }}
                          />
                          <p>
                            O teste <span>não</span> estará mais{' '}
                            <span>disponível</span> para ser realizado e será
                            dado como <span>encerrado</span>.
                          </p>
                        </li>
                        <li>
                          <CloseRoundedIcon
                            style={{ color: 'var(--vermelho-1)', opacity: 0.7 }}
                          />
                          <p>
                            Não será mais possível <span>convidar</span> novos
                            candidatos para realizar o teste.
                          </p>
                        </li>
                        <li>
                          <CheckRoundedIcon
                            style={{ color: 'var(--azul-1)' }}
                          />
                          <p>
                            Você poderá <span>reabrir</span> o teste ao retornar
                            ao status <span>Publicado</span>.
                          </p>
                        </li>
                      </ul>
                    )}
                    {examData.status === 'archived' && (
                      <ul>
                        <li>
                          <CheckRoundedIcon
                            style={{ color: 'var(--azul-1)' }}
                          />
                          <p>
                            Você poderá convidar <span>novos candidatos</span>{' '}
                            para o teste, e o <span>histórico</span> anterior
                            será <span>mantido</span>.
                          </p>
                        </li>
                        <li>
                          <CheckRoundedIcon
                            style={{ color: 'var(--azul-1)' }}
                          />
                          <p>
                            Você pode <span>arquivar</span> o teste novamente a
                            qualquer momento.
                          </p>
                        </li>
                        <li>
                          <CloseRoundedIcon
                            style={{ color: 'var(--vermelho-1)', opacity: 0.7 }}
                          />
                          <p>
                            Ainda <span>não</span> será possível{' '}
                            <span>editar</span> o teste. Para isso, é necessário{' '}
                            <span>criar</span> um <span>novo teste</span>.
                          </p>
                        </li>
                      </ul>
                    )}
                  </div>
                  {examData.status === 'published' &&
                  isArchivable !== null &&
                  isArchivable !== undefined ? (
                    <div className={styles.xDaysToArchive}>
                      <span>Atenção:</span>
                      <p>
                        Ainda existem testes pendentes, caso não convide novos
                        candidatos, você poderá arquivar o teste daqui a{' '}
                        <span>
                          {isArchivable > 1
                            ? `${isArchivable} dias`
                            : isArchivable === 1
                            ? `${isArchivable} dias`
                            : `${isArchivable * 60} minutos`}
                        </span>
                      </p>
                    </div>
                  ) : (
                    examData.status === 'published' &&
                    isArchivable === null && (
                      <p className={styles.noPendingExams}>
                        Como não existem testes pendentes, você pode seguir com
                        o arquivamento do teste.
                      </p>
                    )
                  )}
                  {isArchivable === null || isArchivable === undefined ? (
                    <>
                      <div className={styles.checkboxContainer}>
                        <label className={styles.checkmarkContainer}>
                          <input
                            onChange={() => {
                              setIsAgree(!isAgree);
                            }}
                            type="checkbox"
                            id="confirmChanges"
                            name="confirmChanges"
                          />
                          <span className={styles.checkmark}></span>
                        </label>
                        <label
                          className={styles.label}
                          htmlFor="confirmChanges"
                        >
                          Entendi as mudanças e desejo seguir com a alteração.
                        </label>
                      </div>

                      <div className={styles.actions}>
                        <Button
                          type="button"
                          actionType="cancel"
                          onClick={() => setSwitchStatusModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          actionType="confirm"
                          onClick={switchStatus}
                          disabled={!isAgree}
                        >
                          {examData.status === 'draft'
                            ? 'Publicar teste'
                            : examData.status === 'published'
                            ? 'Arquivar teste'
                            : 'Republicar teste'}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className={styles.actions}>
                      <Button
                        type="button"
                        actionType="confirm"
                        onClick={() => setSwitchStatusModal(false)}
                      >
                        Entendi
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Modal>
          )}
        </AnimatePresence>
      </>
    );
  }
};

export default ExamPage;
