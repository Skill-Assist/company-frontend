import { FC, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { BiPencil } from "react-icons/bi";
import { TbInfoSquareRounded } from "react-icons/tb";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";

import Layout from "@/components/layout";
import CreateSection from "@/components/createSection";

import examService from "@/services/examService";

import { Exam } from "@/types/exam";

import styles from "./styles.module.scss";
import Modal from "@/components/modal";
import { useRouter } from "next/router";

interface Props {
  examServerData: Exam;
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

const ExamPage: FC<Props> = ({ examServerData }: Props) => {
  const [examData, setExamData] = useState<Exam>(examServerData);

  const [statusOptions, setStatusOptions] = useState([
    {
      value: "draft",
      label: "Rascunho",
      select: examData.status === "draft" ? true : false,
      currentValue: examData.status,
    },
    {
      value: "live",
      label: "Em andamento",
      select: examData.status === "live" ? true : false,
      currentValue: examData.status,
    },
    {
      value: "published",
      label: "Público",
      select: examData.status === "published" ? true : false,
      currentValue: examData.status,
    },
    {
      value: "archived",
      label: "Arquivado",
      select: examData.status === "archived" ? true : false,
      currentValue: examData.status,
    },
  ]);
  const [examEditingloading, setExamEditingLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [toggleStatusLoading, setToggleStatusLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);

  const router = useRouter();

  const fetchData = async () => {
    const examId = router.query.examId;

    if (examId && typeof examId === "string") {
      const response = await examService.getOwnExam(examId);

      if (response) {
        setExamData(response.data);
      }
    }
  };

  useEffect(() => {
    const currentValue = statusOptions.filter(
      (statusOption) => statusOption.select === true
    )[0].currentValue;

    if (currentValue === examData.status) {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  }, [statusOptions]);

  const selectRef = useRef<HTMLSelectElement>(null);

  const statusHandler = async () => {
    setToggleStatusLoading(true);
    const newStatus = selectRef.current?.value;

    if (!newStatus) return;

    const response = await examService.switchStatus(examData.id, newStatus);

    if (response) {
      toast.success("Status alterado com sucesso!", {
        duration: 3000,
        position: "top-right",
      });
      setToggleStatusLoading(false);
      setDisabledBtn(true);
    } else {
      toast.error("Erro ao alterar status!", {
        duration: 3000,
        position: "top-right",
      });
      setToggleStatusLoading(false);
      setDisabledBtn(false);
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
          <CreateSection
            sections={examData.__sections__}
            examId={examData.id}
            onCreateSection={fetchData}
          />
          <motion.div
            className={styles.examInfos}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={styles.examHeader}>
              <div className={styles.headerTitle}>
                <h2>{examData.title && examData.title}</h2>
                <BiPencil size={25} onClick={open} />
              </div>
              <div className={styles.headerSub}>
                <p>
                  {examData.subtitle && examData.subtitle}{" "}
                  {examData.subtitle && examData.level && "-"}{" "}
                  {examData.level && examData.level}
                </p>
              </div>
            </div>

            <h3>
              <TbInfoSquareRounded />
              Informações do exame
            </h3>
            <div className={styles.infosBox}>
              <div>
                <span>Duração:</span>
                <p>{examData.durationInHours} horas</p>
              </div>
              <div>
                <span>Tempo para submissão:</span>
                <p>{examData.submissionInHours} horas</p>
              </div>
              <div>
                <span>O candidato deve receber sua nota?</span>
                <p>{examData.showScore === true ? "Sim" : "Não"}</p>
              </div>
              <div>
                <span>O exame é público?</span>
                <p>{examData.isPublic === true ? "Sim" : "Não"}</p>
              </div>
            </div>

            <h3>
              <TbInfoSquareRounded />
              Status do exame
            </h3>
            <div className={styles.statusBox}>
              <select
                name="status"
                id="status"
                ref={selectRef}
                onChange={(e) => {
                  if (
                    e.target.value === "draft" ||
                    e.target.value === "archived" ||
                    e.target.value === "published" ||
                    e.target.value === "live"
                  ) {
                    const newStatus:
                      | "live"
                      | "archived"
                      | "draft"
                      | "published" = e.target.value;

                    const newStatusOptions = statusOptions.map(
                      (statusOption) => {
                        if (statusOption.value === newStatus) {
                          return {
                            ...statusOption,
                            select: true,
                            currentValue: newStatus,
                          };
                        } else {
                          return {
                            ...statusOption,
                            select: false,
                            currentValue: newStatus,
                          };
                        }
                      }
                    );

                    setStatusOptions(newStatusOptions);
                  }
                }}
              >
                {statusOptions.map((statusOption) => {
                  return (
                    <option
                      value={statusOption.value}
                      selected={statusOption.select}
                      key={statusOption.value}
                    >
                      {statusOption.label}
                    </option>
                  );
                })}
              </select>
              <button
                disabled={disabledBtn}
                onClick={statusHandler}
                type="button"
              >
                {toggleStatusLoading ? (
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
                {examEditingloading ? (
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
                    <h1>Editar Exame!</h1>
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
  const { examId } = context.params as { examId: string };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/exam/findOne?key=id&value=${examId}&relations=sections&map=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return {
    props: {
      examServerData: data,
    },
  };
};

export default ExamPage;
