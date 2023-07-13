import { FC, FormEvent, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { BsFillTrashFill } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineQuestionCircle } from "react-icons/ai";

import CreateSectionPlaceholder from "../placeholders/createSectionPlaceholder";

import { Section } from "@/types/section";

import sectionService from "@/services/sectionService";

import styles from "./styles.module.scss";
import Link from "next/link";
import CreateQuestionPlaceholder from "../placeholders/createQuestionPlaceholder";
import Modal from "../modal";
import ManualCreator from "../questionCreators/manual";

interface Props {}

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

const CreateQuestion: FC<Props> = ({}: Props) => {
  const [showModal, setShowModal] = useState(false);
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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sectionsContainer}>
          {/* <div className={styles.sectionContainerHeader}>
            {sections && sections.length > 0 && (
              <>
                <h3>Sessões</h3>
                <button onClick={() => setNewSection(true)}>
                  Nova sessão <AiOutlinePlus size={25} />
                </button>
              </>
            )}
          </div> */}

          {/* MAP DE SECTIONS EXISTENTES */}
          {/* {sections &&
            sections.length > 0 &&
            sections.map((section, index) => {
              return (
                <motion.div
                  className={styles.section}
                  variants={dropIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className={styles.cardHeader}>
                    <h3>Sessão {index + 1}</h3>
                    <BsFillTrashFill
                      className={styles.deleteIcon}
                      size={20}
                      fill="var(--warning)"
                      onClick={() =>
                        toast.loading("Feature em desenvolvimento", {
                          duration: 3000,
                          position: "top-right",
                        })
                      }
                    />
                  </div>
                  <div>
                    <div className={styles.formsContent}>
                      <div>
                        <div className={styles.infoBox}>
                          <span>Nome da sessão:</span>
                          <p>{section.name}</p>
                        </div>
                        <div className={styles.infoBox}>
                          <span>Descrição</span>
                          <p>{section.description}</p>
                        </div>
                      </div>
                      <div>
                        <div className={styles.infoBox}>
                          <div>
                            <span>Peso da sessão</span>
                            <p>{+section.weight * 100}%</p>
                          </div>
                        </div>
                        <div className={styles.infoBox}>
                          <span>Duração da sessão</span>
                          <p>
                            {section.durationInHours > 1
                              ? section.durationInHours + " horas"
                              : section.durationInHours + " hora"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.buttonContainer}>
                      <Link href={`/exams/${examId}/${section.id}`}>Ver Sessão</Link>
                    </div>
                  </div>
                </motion.div>
              );
            })} */}

          {/* FORMULÁRIO DE NOVA SECTION */}
          {/* {newSection && (
            <motion.div
              className={styles.section}
              variants={dropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.cardHeader}>
                <h3>Nova sessão</h3>
                <BsFillTrashFill
                  className={styles.deleteIcon}
                  size={20}
                  fill="var(--warning)"
                  onClick={() => setNewSection(false)}
                />
              </div>
              <form onSubmit={submitHandler}>
                <div className={styles.formsContent}>
                  <div>
                    <div className={styles.field}>
                      <label>Nome da sessão</label>
                      <input
                        required
                        type="text"
                        placeholder="Insira o nome..."
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        minLength={3}
                        maxLength={15}
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Descrição</label>
                      <input
                        required
                        type="text"
                        placeholder="Insira a descrição..."
                        minLength={15}
                        maxLength={100}
                        value={sectionDescription}
                        onChange={(e) => setSectionDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className={styles.field}>
                      <div>
                        <label>Peso da sessão (%)</label>
                        <Tooltip
                          className={styles.tooltip}
                          content={
                            "De 0 a 100, quantos porcentos da nota total você deseja que essa sessão represente?"
                          }
                        >
                          <AiOutlineQuestionCircle fill="var(--secondary-2)" />
                        </Tooltip>
                      </div>
                      <input
                        required
                        type="number"
                        max={100}
                        min={1}
                        placeholder="1 a 100"
                        value={sectionWeight}
                        onChange={(e) =>
                          setSectionWeight(Number(e.target.value))
                        }
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Duração da sessão (hrs)</label>
                      <input
                        required
                        type="number"
                        placeholder="Insira a quantidade de horas..."
                        value={sectionDuration}
                        onChange={(e) =>
                          setSectionDuration(Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.buttonContainer}>
                  <button type="submit">Criar sessão</button>
                </div>
              </form>
            </motion.div>
          )} */}
        </div>

        {/* PLACEHOLDER */}
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
            <div className={styles.modalContainer}>
              {modalContent === "manual" && (
                <ManualCreator />
              )}
              {modalContent === "wizard" && "wizard"}
              {modalContent === "ai" && "ai"}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateQuestion;
