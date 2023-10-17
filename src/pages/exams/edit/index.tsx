import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Lottie from 'lottie-react';

import Layout from '@/components/layout';
import ExamPreview from '@/components/examPreview';
import SelectField from '@/components/UI/selectField';
import InputField from '@/components/UI/inputField';
import Modal from '@/components/modal';

import examCreated from '@public/lottie/examCreated.json';

import examService from '@/services/examService';

import { Exam } from '@/types/exam';

import styles from './styles.module.scss';
import Skeleton from 'react-loading-skeleton';
import Button from '@/components/UI/button';
import { CircularProgress } from '@mui/material';

const previewDropIn = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
  },
  exit: {
    y: '-100%',
    opacity: 0,
  },
};

const suggestDescription = async (
  jobTitle: string,
  jobLevel: string,
  setDescription: (description: string) => void,
  setDescriptionLoading: (loading: boolean) => void
) => {
  setDescriptionLoading(true);
  const response = await examService.suggestDescription({
    jobTitle,
    jobLevel,
  });

  console.log(response);

  if (response.status >= 200 && response.status < 300) {
    setDescription(response.data);
    setDescriptionLoading(false);
  } else {
    setDescriptionLoading(false);
    toast.error('Erro ao sugerir descrição', {
      duration: 3000,
      position: 'top-center',
    });
    return;
  }
};

const EditExam: FC = () => {
  const [createLoading, setCreateLoading] = useState(false);
  const [descriptionLoading, setDescriptionLoading] = useState(false);

  const [jobTitle, setJobTitle] = useState('');
  const [jobLevel, setLevel] = useState<string>('');
  const [description, setDescription] = useState('');
  const [examDuration, setExamDuration] = useState('');
  const [examSubmissionDays, setExamSubmissionDays] = useState<number>();
  const [showScore, setShowScore] = useState(true);
  const [isPublic, setIsPublic] = useState(true);

  const prevJobLevel = useRef('');

  const [showModal, setShowModal] = useState(false);

  const [examCreatedData, setExamCreatedData] = useState<Exam>();

  let timer: NodeJS.Timeout | undefined;

  useEffect(() => {
    if (jobLevel !== prevJobLevel.current) {
      prevJobLevel.current = jobLevel;
      if (jobTitle !== '' && jobLevel !== '' && description === '') {
        suggestDescription(
          jobTitle,
          jobLevel,
          setDescription,
          setDescriptionLoading
        );
      }
    } else {
      timer = setTimeout(() => {
        if (jobTitle !== '' && jobLevel !== '' && description === '') {
          suggestDescription(
            jobTitle,
            jobLevel,
            setDescription,
            setDescriptionLoading
          );
        }
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [jobTitle, jobLevel]);

  const handleIsPublicClick = (event: any): void => {
    if (event.target.value === 'Sim') {
      setIsPublic(true);
    } else {
      setIsPublic(false);
    }
  };

  const handleShowScoreClick = (event: any): void => {
    event.preventDefault();
    if (event.target.value === 'Sim') {
      setShowScore(true);
    } else {
      setShowScore(false);
    }
  };

  const createExamHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !jobTitle ||
      !jobLevel ||
      !description ||
      !examDuration ||
      !examSubmissionDays
    ) {
      toast.error('Preencha todos os campos', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }
    setCreateLoading(true);

    const durationInHours = +(
      Number(examDuration.split(':')[0]) +
      Number(examDuration.split(':')[1]) / 60
    ).toFixed(2);

    const submissionInHours = examSubmissionDays * 24;

    const exam = {
      jobTitle,
      jobLevel,
      description,
      durationInHours,
      submissionInHours,
      showScore,
      isPublic,
    };

    const response = await examService.createExam(exam);

    if (response.status >= 200 && response.status < 300) {
      localStorage.setItem('examId', response.data.id);
      setCreateLoading(false);
      setExamCreatedData(response.data);
      setShowModal(true);
      return;
    } else {
      setCreateLoading(false);
      toast.error('Erro ao criar teste', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }
  };

  return (
    <>
      <Layout sidebar header>
        {createLoading ? (
          <div className="loadingContainer">
            <CircularProgress style={{ color: 'var(--primary)' }} />
          </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles.intro}>
                <h1 onClick={() => setShowModal(true)}>
                  Vamos criar um novo teste!
                </h1>
                <p>Para isso, precisamos de algumas informações. </p>
                <p>
                  Ah, algumas delas serão geradas automaticamente e você poderá
                  editá-las!
                </p>
              </div>

              <form onSubmit={createExamHandler} id="createExam">
                <p className={styles.subtitle}>
                  Informações da vaga em que o teste será usado:
                </p>
                <div className={styles.jobInfos}>
                  <InputField
                    type="text"
                    label="Nome da vaga"
                    required
                    placeholder="Summer Job XPTO..."
                    setState={setJobTitle}
                    value={jobTitle}
                    max={50}
                    counter
                  />
                  <SelectField
                    label="Nível da vaga"
                    required
                    options={[
                      'Estágio',
                      'Trainee',
                      'Júnior',
                      'Pleno',
                      'Sênior',
                      'Outro',
                    ]}
                    onChange={setLevel}
                  />
                </div>
                <p className={styles.subtitle}>Informações do teste:</p>
                <div className={styles.examInfos}>
                  {descriptionLoading ? (
                    <Skeleton height={115} width={1080} />
                  ) : (
                    <InputField
                      type="text"
                      label="Descrição do teste"
                      required
                      placeholder="Esse teste irá comprovar suas habilidades..."
                      helperText="Breve descrição do objetivo do teste."
                      rows={4}
                      setState={setDescription}
                      value={description}
                      counter
                      max={400}
                    />
                  )}
                  <div className={styles.row}>
                    <InputField
                      type="time"
                      label="Duração do teste (horas : minutos)"
                      required
                      helperText="Tempo de resposta após o início do teste."
                      setState={setExamDuration}
                    />
                    <InputField
                      type="number"
                      min={1}
                      label="Prazo de envio (em dias)"
                      required
                      helperText="Prazo para o candidato responder ao teste após aceitar o convite (finalizando ás 23:59 do último dia)."
                      setState={setExamSubmissionDays}
                      innerText={examSubmissionDays === 1 ? 'dia' : 'dias'}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>
                      O candidato deve receber feedback do teste? <span>*</span>
                    </label>
                    <div className={styles.radios}>
                      <div>
                        <button
                          type="button"
                          value="Sim"
                          onClick={handleShowScoreClick}
                          className={showScore ? styles.active : ''}
                        >
                          .
                        </button>
                        <label>Sim</label>
                      </div>
                      <div>
                        <button
                          type="button"
                          value="Não"
                          onClick={handleShowScoreClick}
                          className={!showScore ? styles.active : ''}
                        >
                          .
                        </button>
                        <label>Não</label>
                      </div>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>
                      Permite que o teste seja adicionado ao banco de testes da
                      plataforma? <span>*</span>
                    </label>
                    <p>
                      Ao permitir, outras empresas poderão utilizá-lo em seus
                      processos.
                    </p>
                    <div className={styles.radios}>
                      <div>
                        <div>
                          <button
                            type="button"
                            value="Sim"
                            onClick={handleIsPublicClick}
                            className={isPublic ? styles.active : ''}
                          >
                            .
                          </button>
                          <label>Sim</label>
                        </div>
                        <div>
                          <button
                            type="button"
                            value="Não"
                            onClick={handleIsPublicClick}
                            className={!isPublic ? styles.active : ''}
                          >
                            .
                          </button>
                          <label>Não</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <motion.div
              variants={previewDropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ExamPreview
                examTitle={jobTitle}
                examDescription={description}
                examDuration={examDuration}
                examSubmissionDay={examSubmissionDays}
                examLevel={jobLevel}
                examShowScore={showScore}
                examIsPublic={isPublic}
              />
            </motion.div>
          </div>
        )}
      </Layout>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showModal && (
          <Modal
            handleClose={() => {}}
            dimensions={{
              height: '476px',
              width: '744px',
            }}
            sidebarOn={true}
          >
            <div className={styles.modalContent}>
              <div className={styles.lottie}>
                <Lottie animationData={examCreated} />
              </div>
              <h1 onClick={() => setShowModal(false)}>
                Seu novo teste foi criado!
              </h1>
              <p>
                Por enquanto seu teste{' '}
                <span>“{examCreatedData?.jobTitle}”</span> está como{' '}
                <span>RASCUNHO</span> e ainda pode ser editado. Para publicá-lo
                e começar a convidar candidatos, basta acessá-lo na página “Seus
                testes” e alterar seu status. Agora, você pode começar a criar
                as seções do seu teste!
              </p>
              <Button
                fontColor="var(--neutral-0)"
                backgroundColor="var(--primary)"
                type="link"
                url={`/exams/${examCreatedData?.id}`}
              >
                Vamos lá!
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditExam;
