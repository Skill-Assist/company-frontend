import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { BiPencil } from "react-icons/bi";
import { TbInfoSquareRounded } from "react-icons/tb";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";

import Layout from "@/components/layout";
import CreateQuestion from "@/components/createQuestion";
import Modal from "@/components/modal";

import sectionService from "@/services/sectionService";

import { Section } from "@/types/section";

import styles from "./styles.module.scss";

interface Props {
  sectionServerData: Section;
}

const dropIn = {
  hidden: {
    x: "100%",
    opacity: 0,
  },
  visible: {
    x: "0",
    opacity: 1,
  },
  exit: {
    x: "-100%",
    opacity: 0,
  },
};

const SectionPage: FC<Props> = ({ sectionServerData }: Props) => {
  const [sectionData, setSectionData] = useState<Section>(sectionServerData);
  const [sectionEditingloading, setSectionEditingLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);
  const dateRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("sectionName", sectionData.name || "");
  }, []);

  const fetchData = async () => {
    const sectionId = router.query.sectionId;

    if (sectionId && typeof sectionId === "string") {
      const response = await sectionService.getOwnSection(sectionId);

      if (response) {
        setSectionData(response.data);
      }
    }
  };

  const handleCheckbox = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const sectionId = router.query.sectionId;

    let updatedSection = {};

    if (name === "isShuffleQuestions") {
      updatedSection = {
        isShuffleQuestions: checked,
      };
    } else if (name === "hasProctoring") {
      updatedSection = {
        hasProctoring: checked,
      };
    }

    if (sectionId && typeof sectionId === "string") {
      setSectionEditingLoading(true);

      const response = await sectionService.updateSection(
        sectionId,
        updatedSection
      );

      console.log(response);

      if (response) {
        await fetchData();
        setSectionEditingLoading(false);
        toast.success("Informação atualizada com sucesso!", {
          duration: 2000,
          position: "top-right",
        });
      } else {
        setSectionEditingLoading(false);
        toast.error("Erro ao atualizar informação!", {
          duration: 2000,
          position: "top-right",
        });
      }
    }
  };

  const handleDate = async () => {
    const sectionId = router.query.sectionId;
    const enteredDate = dateRef.current?.value;

    if (sectionId && typeof sectionId === "string" && enteredDate) {
      setSectionEditingLoading(true);

      const updatedSection = {
        startDate: new Date(enteredDate),
      };

      const response = await sectionService.updateSection(
        sectionId,
        updatedSection
      );

      console.log(response);

      if (response) {
        await fetchData();
        setSectionEditingLoading(false);
        toast.success("Data atualizada com sucesso!", {
          duration: 2000,
          position: "top-right",
        });
      } else {
        setSectionEditingLoading(false);
        toast.error("Erro ao atualizar data!", {
          duration: 2000,
          position: "top-right",
        });
      }
    }
  };

  return (
    <>
      <Layout
        sidebar
        sidebarClosed
        header
        headerTitle="Seu Exame"
        contentClassName={styles.p0}
      >
        <div className={styles.container}>
          <CreateQuestion />
          <motion.div
            className={styles.sectionInfos}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.sectionHeader}>
              <div className={styles.headerTitle}>
                <h2>{sectionData.name && sectionData.name}</h2>
                <BiPencil size={25} onClick={open} />
              </div>
              <div className={styles.headerSub}>
                <p>{sectionData.description && sectionData.description}</p>
              </div>
            </div>

            <h3>
              <TbInfoSquareRounded />
              Pontos principais
            </h3>
            <div className={styles.infosBox}>
              <div>
                <span>Duração:</span>
                <p>{sectionData.durationInHours} horas</p>
              </div>
              <div>
                <span>Peso da sessão:</span>
                <p>{+sectionData.weight * 100}%</p>
              </div>
            </div>

            <h3>
              <TbInfoSquareRounded />
              Informações opicionais
            </h3>
            <div className={styles.optionalInfos}>
              <div>
                <span>Data de início:</span>
                <input
                  className={styles.dateInput}
                  type="date"
                  name="startDate"
                  id="startDate"
                  ref={dateRef}
                  onChange={() => setDisabledBtn(false)}
                />
              </div>
              <div>
                <span>Perguntas embaralhadas?</span>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    name="isShuffleQuestions"
                    id="isShuffleQuestions"
                    checked={sectionData.isShuffleQuestions}
                    onChange={handleCheckbox}
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </div>
              <div>
                <span>Proctoring ativado?</span>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    name="hasProctoring"
                    id="hasProctoring"
                    checked={sectionData.hasProctoring}
                    onChange={handleCheckbox}
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </div>
            </div>

            <div className={styles.actions}>
              <button disabled={disabledBtn} type="button" onClick={handleDate}>
                {sectionEditingloading ? (
                  <ThreeDots
                    height="15"
                    width="15"
                    radius="9"
                    color="white"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    visible={true}
                  />
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </motion.div>
        </div>
        <Toaster />
      </Layout>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showModal && (
          <Modal
            handleClose={close}
            dimensions={{
              height: "200px",
              width: "600px",
            }}
          >
            <div className={styles.modalContainer}>
              <>
                {sectionEditingloading ? (
                  <div className={styles.loadingContainer}>
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
                ) : (
                  <>
                    <h1>Editar Section!</h1>
                  </>
                )}
              </>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const { token } = req.cookies;
  const { sectionId } = context.params as { sectionId: string };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/section/findOne?key=id&value=${sectionId}&map=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return {
    props: {
      sectionServerData: data,
    },
  };
};

export default SectionPage;
