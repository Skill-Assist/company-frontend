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
import SectionSideBar from "@/components/sectionSideBar";

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
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const close = () => setShowModal(false);
  const open = () => setShowModal(true);

  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("sectionName", sectionData.name || "");
  }, []);

  const fetchOwnSection = async () => {
    const sectionId = router.query.sectionId;

    if (sectionId && typeof sectionId === "string") {
      const response = await sectionService.getOwnSection(sectionId);

      if (response.status >= 200 && response.status < 300) {
        setSectionData(response.data);
      } else {
        toast.error("Erro ao buscar seção!");
      }
    }
  };

  return (
    <>
      <Layout
        sidebar
        sidebarClosed
        header
        goBack
        headerTitle="Seu Exame"
        contentClassName={styles.p0}
      >
        <div className={styles.container}>
          <CreateQuestion section={sectionData} />
          <motion.div
            className={styles.sectionInfos}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SectionSideBar
              sectionData={sectionData}
              open={open}
              fetchOwnSection={fetchOwnSection}
            />
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
                {loading ? (
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
