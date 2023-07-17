import { FC, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CreateQuestionPlaceholder from "@/components/placeholders/createQuestionPlaceholder";

import QuestionCard from "@/components/questionCard";
import ManualCreator from "@/components/questionCreators/manual";
import Modal from "@/components/modal";

import questionService from "@/services/questionService";

import { Section } from "@/types/section";
import { Question } from "@/types/question";

import styles from "./styles.module.scss";

interface Props {
  section: Section;
  fetchOwnSection: () => any;
}

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const CreateQuestion: FC<Props> = ({ section, fetchOwnSection }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [modalContent, setModalContent] = useState<
    "manual" | "wizard" | "ai" | ""
  >("");
  const close = () => {
    setShowModal(false);
    setModalContent("");
  };

  const open = (content: "manual" | "wizard" | "ai") => {
    setShowModal(true);
    setModalContent(content);
  };

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    const sectionData = await fetchOwnSection();

    const response = await questionService.getAllQuestions(sectionData.questions);

    if (
      response === undefined ||
      response === null ||
      response.status === (400 || 500 || 404 || 401)
    ) {
      setLoadingQuestions(false);
    } else {
      setQuestions(response);
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sectionsContainer}>
          {questions && questions.length > 0 && (
            <div className={styles.stroke}>
              <button onClick={() => open("manual")}>Manual</button>
              <button onClick={() => open("wizard")}>Wizard</button>
              <button onClick={() => open("ai")}>IA</button>
            </div>
          )}

          {/* MAP DE SECTIONS EXISTENTES */}
          {!loadingQuestions &&
            questions.length > 0 &&
            questions.map((question, index) => {
              return (
                <motion.div
                  className={styles.section}
                  variants={dropIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={index}
                >
                  <QuestionCard question={question} index={index} />
                </motion.div>
              );
            })}
        </div>

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
              <CreateQuestionPlaceholder open={open} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showModal && (
          <Modal
            handleClose={close}
            dimensions={{
              height: "90%",
              width: "100%",
            }}
          >
            {modalContent === "manual" && (
              <ManualCreator close={close} fetchQuestions={fetchQuestions} />
            )}
            {modalContent === "wizard" && "wizard"}
            {modalContent === "ai" && "ai"}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateQuestion;
