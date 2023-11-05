import { FC, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import Plus from '@public/icons/fa/plus.svg';
import RunningMan from '@public/lottie/runningMan.json';

import QuestionCard from '@/components/questionCard';
import Button from '@/components/UI/button';
import Modal from '@/components/modal';

import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import questionService from '@/services/questionService';

import { Question } from '@/types/question';
import { Section } from '@/types/section';

import styles from './styles.module.scss';
import NoContentPlaceholder from '@/components/placeholders/noContentPlaceholder';
import SelectField from '@/components/UI/selectField';
import Lottie from 'lottie-react';
import QuestionForm from '@/components/questionForm';

interface Props {
  examId: number;
  examDuration: number;
  headerOpen: boolean;
  fetchOwnSection: () => Promise<Section | undefined>;
  sectionData: Section | undefined;
}

const phrases = [
  'Aquecendo os motores...',
  'Conversando com meus circuitos...',
  'Carregando o banco de dados de conhecimento...',
  'Analisando os tópicos relevantes para o teste...',
  'Gerando questões dignas de um filme de ficção científica!',
  'Priorizando perguntas intrigantes...',
  'Revisando as perguntas geradas...',
  'Aprimorando as questões com base nas últimas tendências...',
  'Apertando alguns parafusos e ajustando as últimas questões...',
];

const dropIn = {
  hidden: {
    y: '100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '-100vh',
    opacity: 0,
  },
};

const fetchQuestionsSuggestions = async (
  testQuestionTypes: {
    objective: boolean;
    discursive: boolean;
    programming: boolean;
  },
  testQuestionAmount: string,
  projectQuestionAmount: string,
  setShowSetupSectionModal: (value: boolean) => void
  // sectionType: string
) => {
  console.log('testQuestionTypes', testQuestionTypes);
  console.log('testQuestionAmount', testQuestionAmount);
  console.log('projectQuestionAmount', projectQuestionAmount);

  // setSuggestionsLoading(true);

  // const response = await sectionService.suggestSections(examId);

  // if (response.status >= 200 && response.status < 300) {
  //   setSectionsSuggestions(response.data);
  //   setSuggestionsLoading(false);
  // } else {
  //   toast.error('Erro ao sugerir seções', {
  //     duration: 3000,
  //     position: 'top-center',
  //   });
  //   setSuggestionsLoading(false);
  // }
  setShowSetupSectionModal(false);
};

const QuestionsContainer: FC<Props> = ({
  examId,
  examDuration,
  headerOpen,
  fetchOwnSection,
  sectionData,
}: Props) => {
  const [showSetupSectionModal, setShowSetupSectionModal] = useState(true);

  const [projectQuestionAmount, setProjectQuestionAmount] = useState('1');
  const [testQuestionAmount, setTestQuestionAmount] = useState('1');
  const [testQuestionTypes, setTestQuestionTypes] = useState({
    objective: false,
    discursive: false,
    programming: false,
  });

  const [newQuestion, setNewQuestion] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionSuggestionsLoading, setQuestionSuggestionsLoading] =
    useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);

  const fetchQuestions = async () => {
    setQuestionsLoading(true);
    const sectionData = await fetchOwnSection();

    if (
      sectionData &&
      sectionData.questions &&
      sectionData.questions.length > 0
    ) {
      const response = await questionService.getAllQuestions(
        sectionData.questions
      );

      if (response.status >= 400) {
        setQuestionsLoading(false);
        setQuestions([]);
      } else {
        setQuestions(response.reverse());
        setQuestionsLoading(false);
      }
    } else {
      setQuestionsLoading(false);
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: 'var(--cinza-4)',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'var(--cinza-4)',
      width: 188,
      fontSize: 10,
    },
  }));

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    if (questionSuggestionsLoading) {
      const timer = setInterval(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      }, 2000);

      return () => {
        clearInterval(timer);
      };
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.questionContainer}>
          <div className={styles.questionContainerHeader}>
            <h2>
              <span>Seção </span> "{sectionData?.name}"
            </h2>
            <div>
              <StyledTooltip title={''}>
                <span>
                  <Button
                    onClick={() => setNewQuestion(true)}
                    actionType="action2"
                    type="button"
                    dimensions={{ width: '25rem!important', height: '5rem' }}
                  >
                    <div className={styles.newQuestionBtn}>
                      <Image
                        src={Plus}
                        width={44}
                        height={44}
                        alt="plus_icon"
                      />
                      Criar nova questão
                    </div>
                  </Button>
                </span>
              </StyledTooltip>
            </div>
          </div>
          <div
            className={`${styles.questionsContent} ${
              headerOpen ? styles.headerOpen : null
            }`}
          >
            <AnimatePresence
              initial={false}
              mode="wait"
              onExitComplete={() => null}
            >
              {/* MAP DE QUESTIONS EXISTENTES */}
              {!questionsLoading &&
                questions.length > 0 &&
                questions.map((question, index) => {
                  return (
                    <motion.div
                      variants={dropIn}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      key={index}
                    >
                      <QuestionCard
                        question={question}
                        index={+questions.length - index}
                      />
                    </motion.div>
                  );
                })}

              {newQuestion && (
                <motion.div
                  variants={dropIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <QuestionForm index={questions ? questions.length : 1} />
                </motion.div>
              )}

              {/* PLACEHOLDER */}
              {!questionsLoading && !newQuestion && questions.length === 0 && (
                <motion.div
                  className={styles.placeholderContainer}
                  variants={dropIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <NoContentPlaceholder
                    onClick={() => setNewQuestion(true)}
                    title="Ainda não existem questões para o sua seção..."
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed 
                      ultricies, sapien quis ultrices aliquet, nisl nisi aliquam
                      nunc, vitae aliquam nunc nisl nec nisl."
                    buttonText="Criar questão"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showSetupSectionModal && (
          <Modal
            handleClose={() => {}}
            dimensions={{
              width: '927px',
              height: '809px',
            }}
            sidebarOn
          >
            {false ? (
              <div className={styles.loadingContainer}>
                <h1>Configurando a seção....</h1>
                <p>
                  Agora, nossa IA está gerando as questões para a sua seção,
                  isso levará alguns segundos...
                </p>
                <div className={styles.lottie}>
                  <Lottie animationData={RunningMan} />
                </div>
                <p className={styles.phrases}>{phrases[currentPhraseIndex]}</p>
              </div>
            ) : (
              <div className={styles.setupSectionModal}>
                <h1>Vamos configurar a Seção!</h1>
                <p className={styles.introP}>
                  Para isso, precisamos definir as questões dessa seção para a
                  nossa IA gerar as sugestões. <br />
                  <span>Defina as questões::</span>
                </p>
                {false ? (
                  <div className={styles.setupContent}>
                    <h3>Seção {sectionData?.id}</h3>
                    <p>
                      Seção com apenas{' '}
                      <span>1 opção de questão, a questão desafio.</span>
                      Uma questão desafio contém um <span>projeto</span> que o
                      candidato deverá desenvolver e que{' '}
                      <span>pode ser entregue a qualquer momento</span> enquanto
                      o teste estiver disponível.{' '}
                    </p>
                    <br />
                    <div className={styles.selectContainer}>
                      <p>Número de questões</p>
                      <span>Limite de 3 questões devido à complexidade </span>
                      <div className={styles.selectBox}>
                        <SelectField
                          options={['1', '2', '3']}
                          value={projectQuestionAmount}
                          onChange={setProjectQuestionAmount}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.setupContent}>
                    <h3>Seção {sectionData?.id}</h3>
                    <p>
                      Seção com questões de <span>3 tipos:</span> Objetiva,
                      Discursiva e Programação. As questões devem ser
                      respondidas dentro do tempo limite da seção.
                    </p>
                    <br />
                    <div className={styles.selectContainer}>
                      <p>Número de questões</p>
                      <span>Limite de 10 questões devido à complexidade </span>
                      <div className={styles.selectBox}>
                        <SelectField
                          options={[
                            '1',
                            '2',
                            '3',
                            '4',
                            '5',
                            '6',
                            '7',
                            '8',
                            '9',
                            '10',
                          ]}
                          value={testQuestionAmount}
                          onChange={setTestQuestionAmount}
                        />
                      </div>
                      <div className={styles.questionTypeContainer}>
                        <h4
                          onClick={() => {
                            console.log(testQuestionTypes);
                          }}
                        >
                          Tipos de questões
                        </h4>
                        <div className={styles.checkboxContainer}>
                          <label className={styles.checkmarkContainer}>
                            <input
                              type="checkbox"
                              id="objective"
                              name="objective"
                              checked={testQuestionTypes.objective}
                              onChange={() =>
                                setTestQuestionTypes({
                                  ...testQuestionTypes,
                                  objective: !testQuestionTypes.objective,
                                })
                              }
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label className={styles.label} htmlFor="objective">
                            <span>Objetiva:</span> 5 alternativas com 1 correta.
                          </label>
                        </div>
                        <div className={styles.checkboxContainer}>
                          <label className={styles.checkmarkContainer}>
                            <input
                              type="checkbox"
                              id="discursive"
                              name="discursive"
                              checked={testQuestionTypes.discursive}
                              onChange={() =>
                                setTestQuestionTypes({
                                  ...testQuestionTypes,
                                  discursive: !testQuestionTypes.discursive,
                                })
                              }
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label className={styles.label} htmlFor="discursive">
                            <span>Discursiva:</span> texto com critérios de
                            correção.
                          </label>
                        </div>
                        <div className={styles.checkboxContainer}>
                          <label className={styles.checkmarkContainer}>
                            <input
                              type="checkbox"
                              id="programming"
                              name="programming"
                              checked={testQuestionTypes.programming}
                              onChange={() =>
                                setTestQuestionTypes({
                                  ...testQuestionTypes,
                                  programming: !testQuestionTypes.programming,
                                })
                              }
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label className={styles.label} htmlFor="programming">
                            <span>Programação:</span> desafio de código com
                            testes.
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => fetchQuestionsSuggestions(
                    testQuestionTypes,
                    testQuestionAmount,
                    projectQuestionAmount,
                    setShowSetupSectionModal
                  )}
                  type="button"
                  actionType="bigConfirm"
                >
                  Confimar
                </Button>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuestionsContainer;
