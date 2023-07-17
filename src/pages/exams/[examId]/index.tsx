import { FC, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { TailSpin } from "react-loader-spinner";
import toast from "react-hot-toast";

import Layout from "@/components/layout";
import CreateSection from "@/components/createSection";

import examService from "@/services/examService";
import Modal from "@/components/modal";
import ExamSideBar from "@/components/examSideBar";
import CreateInvitation from "@/components/CreateInvitation";

import { Exam } from "@/types/exam";

import styles from "./styles.module.scss";

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
  const [examEditingloading, setExamEditingLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSectionsPage, setShowSectionsPage] = useState(true);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);

  const router = useRouter();

  const fetchData = async () => {
    const examId = router.query.examId;

    if (examId && typeof examId === "string") {
      const response = await examService.getOwnExam(examId);

      if (response.status >= 200 && response.status < 300) {
        setExamData(response.data);
      } else {
        toast.error("Erro ao buscar exame!");
      }
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "exameName",
      examData.title + " " + examData.subtitle + " - " + examData.level || ""
    );
  }, []);

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
          <div className={styles.content}>
            <nav>
              <ul className={styles.stroke}>
                <li
                  className={showSectionsPage ? styles.active : ""}
                  onClick={() => setShowSectionsPage(true)}
                >
                  Sessões
                </li>
                <li
                  className={!showSectionsPage ? styles.active : ""}
                  onClick={() => setShowSectionsPage(false)}
                >
                  Candidatos
                </li>
              </ul>
            </nav>
            {showSectionsPage ? (
              <CreateSection
                sections={examData.__sections__}
                examId={examData.id}
                onCreateSection={fetchData}
              />
            ) : (
              <CreateInvitation />
            )}
          </div>

          <motion.div
            className={styles.examInfos}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ExamSideBar examData={examData} open={open} />
          </motion.div>
        </div>
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

  try {
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
  } catch (error: any) {
    const statusCode = error.response.data.statusCode;
    const message = error.response.data.message;

    if (statusCode === 418 || message.includes("Invalid token")) {
      window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
    }
    return error.response;
  }
};

export default ExamPage;
