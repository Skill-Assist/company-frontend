import { FC, FormEvent, useRef, useState } from 'react';
import { Tooltip, Input, Switch } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { ThreeDots } from 'react-loader-spinner';
import { useLottie } from 'lottie-react';
import Link from 'next/link';

import examService from '@/services/examService';

import Layout from '@/components/layout';

import success from '@public/lottie/success.json';

import styles from './styles.module.scss';
import { toast } from 'react-hot-toast';
import PreviewSideBar from '@/components/sidebars/previewSideBar';

const stepOneDropIn = {
  hidden: {
    y: '-100%',
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

const stepTwoDropIn = {
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

const sideBarDropIn = {
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

const lottieOptions = {
  animationData: success,
  loop: true,
  autoplay: true,
};

const CreateExam: FC = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { View } = useLottie(lottieOptions);

  const [title, setTitle] = useState('');
  const [examDuration, setExamDuration] = useState('');
  const [examSubmissionDays, setExamSubmissionDays] = useState<number>();

  const [subtitle, setSubtitle] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [dateToArchive, setDateToArchive] = useState<Date>();

  const [showScore, setShowScore] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  let examId = localStorage.getItem('examId');

  const createExam = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !examDuration || !examSubmissionDays) {
      setLoading(false);
      toast.error('Preencha todos os campos', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }

    const durationInHours = +(
      Number(examDuration.split(':')[0]) +
      Number(examDuration.split(':')[1]) / 60
    ).toFixed(2);

    const submissionInHours = examSubmissionDays * 24

    const exam = {
      title,
      durationInHours,
      submissionInHours,
    };

    const response = await examService.createExam(exam);

    if (response.status >= 200 && response.status < 300) {
      localStorage.setItem('examId', response.data.id);
      setLoading(false);
      setStep(1);
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao criar teste', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }
  };

  const updateExam = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (dateToArchive) {
      const date = new Date(dateToArchive);
      setDateToArchive(date);
    }

    const updatedExam = {
      subtitle: subtitle ? subtitle : null,
      level: level ? level : null,
      dateToArchive: dateToArchive ? dateToArchive : null,
      showScore: showScore,
      isPublic: isPublic,
    };

    examId = localStorage.getItem('examId');

    const response = await examService.updateExam(updatedExam, Number(examId));

    if (response.status >= 200 && response.status < 300) {
      setLoading(false);
      setStep(2);
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao criar teste', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }
  };

  return (
    <Layout
      sidebar
      sidebarClosed
      header
      goBack
      contentClassName={styles.p0}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          {step === 0 && (
            <motion.div
              className={styles.motionDiv}
              variants={stepOneDropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.intro}>
                <h1 onClick={() => console.log(examDuration)}>
                  Fico feliz em ver você por aqui!
                </h1>
                <p>Para começar precisamos das seguintes informações</p>
              </div>
              <form onSubmit={createExam} id="create">
                <div className={styles.field}>
                  <label htmlFor="title">Título do teste</label>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    id="title"
                    type="text"
                    minLength={3}
                    maxLength={50}
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <div>
                      <label htmlFor="duration">Duração do teste</label>
                      <Tooltip
                        className={styles.tooltip}
                        content={
                          'A partir do momento que o candidato iniciar o teste, quanto tempo ele terá para terminar?'
                        }
                      >
                        <AiOutlineQuestionCircle fill="var(--secondary-2)" />
                      </Tooltip>
                    </div>
                    <input
                      onChange={(e) => setExamDuration(e.target.value)}
                      className={styles.styledInput}
                      type="time"
                      id="duration"
                    />
                  </div>
                  <div className={styles.field}>
                    <div>
                      <label htmlFor="submissionDeadline">
                        Quantidade de dias para o envio das respostas
                      </label>
                      <Tooltip
                        className={styles.tooltip}
                        content={
                          'Prazo para o envio das respostas do candidato a partir do invite.'
                        }
                      >
                        <AiOutlineQuestionCircle fill="var(--secondary-2)" />
                      </Tooltip>
                    </div>
                    <div className={styles.dateBox}>
                      <input
                        onChange={(e) => setExamSubmissionDays(+e.target.value)}
                        className={styles.styledInput}
                        type="number"
                        id="duration"
                      />
                    </div>
                  </div>
                </div>
                <button form="create" type="submit">
                  {loading ? (
                    <ThreeDots
                      height="15"
                      width="15"
                      radius="9"
                      color="var(--primary)!important"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      visible={true}
                    />
                  ) : (
                    'Próximo'
                  )}
                </button>
              </form>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              className={styles.motionDiv}
              variants={stepTwoDropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.intro}>
                <h1>Muito bom! Teste já cadastrado.</h1>
                <p>
                  Agora, caso queira, temos mais algumas informações opcionais
                </p>
              </div>
              <form onSubmit={updateExam} id="update">
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="title">Subtítulo do teste</label>
                    <input
                      onChange={(e) => setSubtitle(e.target.value)}
                      id="subtitle"
                      placeholder="Insira um subtítulo para seu teste"
                      type="text"
                      minLength={3}
                      maxLength={20}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <div>
                      <label htmlFor="level">Nível do teste</label>
                    </div>
                    <input
                      onChange={(e) => setLevel(e.target.value)}
                      className={styles.styledInput}
                      placeholder="Insira um nível para seu teste"
                      type="text"
                      id="level"
                    />
                  </div>
                  <div className={styles.field}>
                    <div>
                      <label htmlFor="dateToArchive">
                        Data para arquivar o teste
                      </label>
                      <Tooltip
                        className={styles.tooltip}
                        content={
                          'Caso pretenda arquivar o teste para não receber mais respostas, selecione uma data.'
                        }
                      >
                        <AiOutlineQuestionCircle fill="var(--secondary-2)" />
                      </Tooltip>
                    </div>
                    <div className={styles.dateBox}>
                      <input
                        onChange={(e) =>
                          setDateToArchive(new Date(e.target.value))
                        }
                        className={styles.styledInput}
                        type="date"
                        id="dateToArchive"
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.toggles}>
                  <div>
                    <p>O candidato deve receber sua nota?</p>
                    <Switch
                      checked={showScore}
                      onChange={() => setShowScore((prevState) => !prevState)}
                      size="md"
                    />
                  </div>
                  <div>
                    <p>O teste é público?</p>
                    <Switch
                      checked={isPublic}
                      onChange={() =>
                        toast.loading('Feature em desenvolvimento', {
                          duration: 3000,
                          position: 'top-right',
                        })
                      }
                      size="md"
                    />
                  </div>
                </div>
                <div className={styles.skipContainar}>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(2);
                    }}
                  >
                    {loading ? (
                      <ThreeDots
                        height="15"
                        width="15"
                        radius="9"
                        color="var(--primary)!important"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        visible={true}
                      />
                    ) : (
                      'Pular'
                    )}
                  </button>
                  <button type="submit" form="update">
                    {loading ? (
                      <ThreeDots
                        height="15"
                        width="15"
                        radius="9"
                        color="var(--primary)!important"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        visible={true}
                      />
                    ) : (
                      'Finalizar'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          <motion.div
            className={styles.motionDiv}
            variants={stepTwoDropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.finishingView}>
              {step === 2 && (
                <div>
                  <div className={styles.intro}>
                    <h1>
                      Perfeito! <br /> O teste foi criado.
                    </h1>
                    <p>
                      O que acha da gente começar a criar as seções do seu
                      teste?
                    </p>
                  </div>
                  <div className={styles.actions}>
                    <Link href={`/exams`}>Meus testes</Link>
                    <Link
                      href={`/exams/${examId}`}
                      className={styles.principalBtn}
                    >
                      Criar seções
                    </Link>
                  </div>
                </div>
              )}

              <div
                style={step !== 2 ? { display: 'none' } : {}}
                className={styles.lottie}
              >
                {View}
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          className={styles.previewInfos}
          variants={sideBarDropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <PreviewSideBar
            examTitle={title}
            examDuration={examDuration}
            examSubmissionDay={examSubmissionDays}
            examSubtitle={subtitle}
            examLevel={level}
            examShowScore={showScore}
            examIsPublic={isPublic}
          />
        </motion.div>
      </div>
    </Layout>
  );
};

export default CreateExam;
