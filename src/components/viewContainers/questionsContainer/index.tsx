import { FC, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import Plus from '@public/icons/fa/plus.svg';

import QuestionsContainerPlaceholder from '@/components/placeholders/questionsContainerPlaceholder';
import QuestionCard from '@/components/questionCard';
import Button from '@/components/UI/button';
import Modal from '@/components/modal';

import questionService from '@/services/questionService';

import { Question } from '@/types/question';
import { Section } from '@/types/section';

import styles from './styles.module.scss';

interface Props {
  examId: number;
  examDuration: number;
  headerOpen: boolean;
  fetchOwnSection: () => Promise<Section |  undefined>;
}

const dropIn = {
  hidden: {
    y: '-100vh',
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
    y: '100vh',
    opacity: 0,
  },
};

const QuestionsContainer: FC<Props> = ({
  examId,
  examDuration,
  headerOpen,
  fetchOwnSection,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modalContent, setModalContent] = useState<'manual' | 'ai' | ''>('');
  const close = () => {
    setShowModal(false);
    setModalContent('');
  };

  const open = (content: 'manual' | 'ai') => {
    setShowModal(true);
    setModalContent(content);
  };

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
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
        setLoadingQuestions(false);
        setQuestions([]);
      } else {
        setQuestions(response.reverse());
        setLoadingQuestions(false);
      }
    } else {
      setLoadingQuestions(false);
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.questionContainer}>
          <div className={styles.questionContainerHeader}>
            <h2>
              Nós oferecemos um sistema de recomendação de{' '}
              <span>seções prontas e personalizadas</span> para o objetivo do
              seu teste, e que irão facilitar a navegação pelas questões!
            </h2>
            <Button
              onClick={() => {}}
              actionType="action2"
              type="button"
              dimensions={{ width: '25rem!important', height: '5rem' }}
            >
              <div className={styles.newSectionBtn}>
                <Image src={Plus} width={44} height={44} alt="plus_icon" />
                Criar nova seção
              </div>
            </Button>
          </div>
          <div
            className={`${styles.sectionContent} ${
              headerOpen ? styles.headerOpen : null
            }`}
          >
            <AnimatePresence
              initial={false}
              mode="wait"
              onExitComplete={() => null}
            >
              {/* MAP DE QUESTIONS EXISTENTES */}
              {!loadingQuestions &&
                questions.length > 0 &&
                questions.map((question, index) => {
                  return (
                    <motion.div
                      className={styles.question}
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

              {/* PLACEHOLDER */}
              {!loadingQuestions && questions.length === 0 && (
                <AnimatePresence
                  initial={false}
                  mode="wait"
                  onExitComplete={() => null}
                >
                  <motion.div
                    className={styles.placeholderContainer}
                    variants={dropIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <QuestionsContainerPlaceholder open={open} />
                  </motion.div>
                </AnimatePresence>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {false && (
          <Modal
            handleClose={() => {}}
            dimensions={{
              width: '744px',
              height: '476px',
            }}
            sidebarOn
          >
            oi
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuestionsContainer;
