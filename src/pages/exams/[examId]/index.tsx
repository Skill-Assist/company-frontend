import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { TailSpin } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import { useReadableDuration } from '@/hooks/readableDuration';

import Modal from '@/components/modal';
import Layout from '@/components/layout';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import warning from '@public/lottie/warning.json';

import examService from '@/services/examService';

import { Exam } from '@/types/exam';

import styles from './styles.module.scss';
import Button from '@/components/UI/button';
import { CircularProgress } from '@mui/material';
import InvitationContainer from '@/components/viewContainers/invitationContainer';
import SectionsContainer from '@/components/viewContainers/sectionsContainer';

const ExamPage = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [switchStatusLoading, setSwitchStatusLoading] = useState(false);
  const [examData, setExamData] = useState<Exam>();
  const [showSectionsPage, setShowSectionsPage] = useState(true);
  const [isAgree, setIsAgree] = useState(false);
  const [isArchivable, setIsArchivable] = useState<number>();

  const [open, setOpen] = useState<boolean>(false);
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
        console.log(response);
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

    const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
      <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(() => ({
      [`& .${tooltipClasses.arrow}`]: {
        color: 'var(--primary)',
      },
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'var(--primary)',
        width: 200,
        fontSize: 10,
      },
    }));

    return (
      <>
        <Layout sidebar header goBack>
          <div className={styles.container}>
            <header>
              <h1>
                Teste{' '}
                <span>
                  "
                  {examData.jobTitle[0].toLocaleUpperCase() +
                    examData.jobTitle.slice(1)}
                  "
                </span>
              </h1>
              <div className={`${styles.examInfo} ${open ? styles.open : ''}`}>
                <div className={styles.firstRow}>
                  <ul>
                    <li>
                      Nível da vaga:{' '}
                      <span>
                        {examData.jobLevel[0].toLocaleUpperCase() +
                          examData.jobLevel.slice(1)}
                      </span>
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
                  <div className={styles.statusContainer}>
                    <div>
                      <p>
                        Status do teste:{' '}
                        <span>
                          {examData.status === 'draft'
                            ? 'Rascunho'
                            : examData.status === 'published'
                            ? 'Publicado'
                            : 'Arquivado'}
                        </span>
                      </p>
                      <StyledTooltip
                        title={
                          'Os diferentes status definem como é possível interagir com o teste.'
                        }
                      >
                        <InfoOutlinedIcon style={{ color: '#8C8895' }} />
                      </StyledTooltip>
                    </div>
                    <Button
                      backgroundColor="var(--primary-2)"
                      fontColor="var(--primary)"
                      type="button"
                      dimensions={{ width: '260px', height: '60px' }}
                      fontSize="20px"
                      onClick={checkIfArchivableHandler}
                    >
                      {examData.status === 'draft'
                        ? 'Publicar'
                        : examData.status === 'published'
                        ? 'Arquivar'
                        : 'Republicar'}
                    </Button>
                  </div>
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
                        <CloseRoundedIcon style={{ color: '#ff4545b2' }} />
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
                    onClick={() => setShowDeleteModal(true)}
                    dimensions={{ width: '125px', height: ' 41px' }}
                  >
                    Excluir teste
                  </Button>
                  <Button
                    type="link"
                    backgroundColor="var(--primary-4)"
                    fontColor="var(--neutral-0)"
                    url={`/exams/edit/${examData.id}`}
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
                  headerOpen={open}
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
                  <CircularProgress style={{ color: 'var(--primary)' }} />
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
                      backgroundColor="transparent"
                      fontColor="var(--secondary-2)"
                      borderColor="var(--secondary-2)"
                      onClick={() => setShowDeleteModal(false)}
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
                  <CircularProgress style={{ color: 'var(--primary)' }} />
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
                          <CheckRoundedIcon style={{ color: '#829CE4' }} />
                          <p>
                            Você poderá <span> convidar candidatos</span> para o
                            teste.
                          </p>
                        </li>
                        <li>
                          <CheckRoundedIcon style={{ color: '#829CE4' }} />
                          <p>
                            Os candidatos já poderão{' '}
                            <span> realizar o teste</span>.
                          </p>
                        </li>
                        <li>
                          <CloseRoundedIcon
                            style={{ color: 'rgba(255, 69, 69, 0.7)' }}
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
                            style={{ color: 'rgba(255, 69, 69, 0.7)' }}
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
                            style={{ color: 'rgba(255, 69, 69, 0.7)' }}
                          />
                          <p>
                            O teste <span>não</span> estará mais{' '}
                            <span>disponível</span> para ser realizado e será
                            dado como <span>encerrado</span>.
                          </p>
                        </li>
                        <li>
                          <CloseRoundedIcon
                            style={{ color: 'rgba(255, 69, 69, 0.7)' }}
                          />
                          <p>
                            Não será mais possível <span>convidar</span> novos
                            candidatos para realizar o teste.
                          </p>
                        </li>
                        <li>
                          <CheckRoundedIcon style={{ color: '#829CE4' }} />
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
                          <CheckRoundedIcon style={{ color: '#829CE4' }} />
                          <p>
                            Você poderá convidar <span>novos candidatos</span>{' '}
                            para o teste, e o <span>histórico</span> anterior
                            será <span>mantido</span>.
                          </p>
                        </li>
                        <li>
                          <CheckRoundedIcon style={{ color: '#829CE4' }} />
                          <p>
                            Você pode <span>arquivar</span> o teste novamente a
                            qualquer momento.
                          </p>
                        </li>
                        <li>
                          <CloseRoundedIcon
                            style={{ color: 'rgba(255, 69, 69, 0.7)' }}
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
                      <div className={styles.confirmChanges}>
                        <label className={styles.checkboxContainer}>
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
                          backgroundColor="transparent"
                          fontColor="var(--secondary-2)"
                          borderColor="var(--secondary-2)"
                          onClick={() => setSwitchStatusModal(false)}
                          boxShadow={false}
                          fontWeight="400"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          backgroundColor="var(--primary)"
                          fontColor="var(--neutral-0)"
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
                        backgroundColor="var(--primary)"
                        fontColor="var(--neutral-0)"
                        onClick={() => setSwitchStatusModal(false)}
                        boxShadow={false}
                        fontWeight="400"
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
