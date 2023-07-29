import { FC, useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import { AnimatePresence } from "framer-motion";
import parse from "html-react-parser";
import { TailSpin } from "react-loader-spinner";
import {
  AiFillTag,
  AiOutlineCloseCircle,
  AiOutlineCloudDownload,
} from "react-icons/ai";
import Editor from "@monaco-editor/react";
import { toast } from "react-hot-toast";

import Modal from "../modal";

import { Answer } from "@/types/answer";
import { Question } from "@/types/question";
import { Section } from "@/types/section";

import questionService from "@/services/questionService";

import styles from "./styles.module.scss";

interface Props {
  section: Partial<Section>;
  sectionScore: string;
  loading: boolean;
  rows: any[];
  open: boolean | undefined;
  index: number;
  toggleSection: (index: number) => void;
}

const ScoredSection: FC<Props> = ({
  section,
  sectionScore,
  loading,
  rows,
  open,
  index,
  toggleSection,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [modalContent, setModalContent] = useState<{
    question: Question;
    index: number;
  }>();
  const closeModal = () => {
    setShowModal(false);
    setModalContent({
      question: {} as Question,
      index: 0,
    });
  };

  const openModal = async (questionId: string, index: number) => {
    setShowModal(true);
    setLoadingQuestion(true);
    const reponse = await questionService.getOneQuestion(questionId);

    if (reponse.status >= 200 && reponse.status < 300) {
      setModalContent({
        question: reponse.data,
        index: index,
      });
      setLoadingQuestion(false);
    } else {
      alert("Erro ao carregar questão");
      setLoadingQuestion(false);
    }
  };

  return (
    <>
      <div className={styles.rowsContainer}>
        <div className={styles.divisor} onClick={() => toggleSection(index)}>
          <p>Nome</p>
          <p style={{ justifySelf: "center" }}>Peso</p>
          <p style={{ justifySelf: "center" }}>Nota</p>
          <BsArrowDown
            size={25}
            className={open ? styles.rotate : ""}
            style={{ justifySelf: "flex-end" }}
          />
        </div>
        <div className={`${styles.rows} ${open ? styles.open : ""}`}>
          {!loading &&
            rows.length > 0 &&
            rows.map((row: Answer, index: number) => {
              return (
                <div className={styles.row}>
                  <p>Questão {index + 1}</p>
                  <p style={{ justifySelf: "center" }}>
                    {section.questions && section.questions[index].weight}
                  </p>
                  <p style={{ justifySelf: "center" }}>{+row.aiScore * 10}</p>
                  <button
                    style={{ justifySelf: "center" }}
                    onClick={() => openModal(row.questionRef, index)}
                  >
                    Ver detalhes
                  </button>
                </div>
              );
            })}
          <div className={styles.sectionData}>
            <p>{section.name}</p>
            <p style={{ justifySelf: "center" }}>
              {" "}
              Peso da seção: {section.weight && +section.weight * 100 + "%"}
            </p>
            <p style={{ justifySelf: "center" }}>
              Nota da seção: {+sectionScore * 10}
            </p>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showModal && (
          <Modal
            handleClose={closeModal}
            dimensions={{
              height: "90%",
              width: "100%",
            }}
          >
            {loadingQuestion && (
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
            )}
            {!loadingQuestion && modalContent?.question && (
              <div className={styles.modalContent}>
                <AiOutlineCloseCircle
                  size={30}
                  className={styles.closeBtn}
                  onClick={closeModal}
                />
                <div className={styles.questionContent}>
                  <h3>Questão {modalContent.index + 1}</h3>
                  {parse(modalContent.question.statement)}
                  {modalContent.question.type === "multipleChoice" &&
                    modalContent.question.options && (
                      <div className={styles.options}>
                        <>
                          <h3>Alternativas</h3>
                          {Object.keys(modalContent.question.options).map(
                            (option, index) => {
                              return (
                                <div className={styles.option} key={index}>
                                  <label className={styles.checkboxContainer}>
                                    <input
                                      type="checkbox"
                                      name="check"
                                      id="check"
                                      disabled
                                      checked={
                                        modalContent.question.gradingRubric
                                          .answer.option === option
                                      }
                                    />
                                    <span className={styles.checkmark}></span>
                                  </label>
                                  <p>
                                    {modalContent.question.options &&
                                      Object.values(
                                        modalContent.question.options
                                      )[index]}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </>
                      </div>
                    )}
                  {modalContent.question.tags &&
                    modalContent.question.tags?.length > 0 && (
                      <div className={styles.tags}>
                        <h3>Tags</h3>
                        <div className={styles.tagsContainer}>
                          {modalContent.question.tags.map((tag, index) => (
                            <div key={index}>
                              <AiFillTag size={20} color="var(--secondary-2)" />
                              <p key={index}>{tag}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
                <hr />
                <div className={styles.answerContent}>
                  <h3>Resposta do usuário</h3>
                  <p>
                    {modalContent.question.type === "multipleChoice" &&
                    modalContent.question.options ? (
                      modalContent.question.options[
                        rows[modalContent.index].content
                      ]
                    ) : modalContent.question.type === "challenge" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        Download do arquivo{" "}
                        <AiOutlineCloudDownload
                          fill="var(--secondary-2)"
                          size={20}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            toast.loading("Feature em desenvolvimento", {
                              duration: 3000,
                              position: "top-right",
                            });
                          }}
                        />
                      </div>
                    ) : modalContent.question.type === "programming" ? (
                      <>
                        <Editor
                          language={"javascript"}
                          theme="vs-dark"
                          value={rows[modalContent.index].content}
                          options={{
                            readOnly: true,
                            minimap: {
                              enabled: false,
                            },
                          }}
                          height="300px"
                        />
                      </>
                    ) : (
                      rows[modalContent.index].content
                    )}
                  </p>
                  <h3>
                    {modalContent.question.type === "multipleChoice"
                      ? "Alternativa Correta"
                      : "Feedback"}
                  </h3>
                  <p>
                    {modalContent.question.type === "multipleChoice" &&
                    modalContent.question.options ? (
                      modalContent.question.options[
                        modalContent.question.gradingRubric.answer.option
                      ]
                    ) : rows[modalContent.index].aiFeedback ? (
                      <pre>{rows[modalContent.index].aiFeedback}</pre>
                    ) : (
                      "Sem feedback"
                    )}
                  </p>
                </div>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScoredSection;
