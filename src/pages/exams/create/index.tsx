import { FC, FormEvent, useRef, useState } from "react";
import { Tooltip, Input, Switch } from "@nextui-org/react";
import { motion } from "framer-motion";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { ThreeDots } from "react-loader-spinner";
import { useLottie } from "lottie-react";

import examService from "@/services/examService";

import Layout from "@/components/layout";

import success from "@public/lottie/success.json";

import styles from "./styles.module.scss";
import Link from "next/link";

const stepOneDropIn = {
  hidden: {
    y: "-100%",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
  },
  exit: {
    y: "-100%",
    opacity: 0,
  },
};

const stepTwoDropIn = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
  },
  exit: {
    y: "-100%",
    opacity: 0,
  },
};

const lottieOptions = {
  animationData: success,
  loop: true,
};

const CreateExam: FC = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { View } = useLottie(lottieOptions);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const durationInputRef = useRef<HTMLInputElement>(null);
  const submissionDeadlineInputRef = useRef<HTMLInputElement>(null);
  
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const levelInputRef = useRef<HTMLInputElement>(null);
  const dateToArchiveInputRef = useRef<HTMLInputElement>(null);
  
  const [showScore, setShowScore] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  
  let examId = localStorage.getItem("examId");

  const createExam = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const title = titleInputRef.current?.value;
    const durationInHours = durationInputRef.current?.value;
    const submissionInHours = submissionDeadlineInputRef.current?.value;

    if (!title || !durationInHours || !submissionInHours) {
      setLoading(false);
      alert("Preencha todos os campos");
      return;
    }

    const exam = {
      title,
      durationInHours: Number(durationInHours),
      submissionInHours: Number(submissionInHours),
    };

    const response = await examService.createExam(exam);

    console.log(response)

    if (response.status !== 200 && response.status !== 201) {
      setLoading(false);
      alert("Erro ao criar exame");
      return;
    } else {
      localStorage.setItem("examId", response.data.id);
      setLoading(false);
      setStep(1);
      return;
    }
  };

  const updateExam = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const subtitle = subtitleInputRef.current?.value;
    const level = levelInputRef.current?.value;
    let dateToArchive;
    if (dateToArchiveInputRef.current?.value) {
      dateToArchive = new Date(dateToArchiveInputRef.current?.value);
    }

    const updatedExam = {
      subtitle,
      level,
      dateToArchive,
      showScore,
      isPublic,
    };

    examId = localStorage.getItem("examId");

    const response = await examService.updateExam(updatedExam, Number(examId));

    if (response.status !== 200 && response.status !== 201) {
      setLoading(false);
      alert("Erro ao criar exame");
      return;
    } else {
      setLoading(false);
      setStep(2);
      return;
    }
  };

  return (
    <Layout sidebar sidebarClosed header goBack headerTitle="Criar Exame">
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
                <h1>Fico feliz em ver você por aqui!</h1>
                <p>Para começar precisamos das seguintes informações</p>
              </div>
              <form onSubmit={createExam} id="create">
                <div className={styles.field}>
                  <Input
                    ref={titleInputRef}
                    className={styles.styledInput}
                    underlined
                    labelPlaceholder="Título do exame"
                    type="text"
                    aria-label="title-input"
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <Input
                      ref={durationInputRef}
                      className={styles.styledInput}
                      underlined
                      labelPlaceholder="Duração em horas"
                      type="number"
                      aria-label="duration-input"
                    />
                    <Tooltip
                      className={styles.tooltip}
                      content={
                        "A partir do momento que o candidato iniciar o exame, quantas horas tera para terminar"
                      }
                    >
                      <AiOutlineQuestionCircle fill="var(--secondary-2)" />
                    </Tooltip>
                  </div>
                  <div className={styles.field}>
                    <Input
                      ref={submissionDeadlineInputRef}
                      className={styles.styledInput}
                      underlined
                      labelPlaceholder="Tempo para submissão em horas"
                      type="number"
                      min={24}
                      aria-label="submission-deadline-input"
                    />
                    <Tooltip
                      className={styles.tooltip}
                      content={
                        "A partir do momento que o candidato receber o convite, quantas horas ele terá para começar o teste e mandar suas respostas"
                      }
                    >
                      <AiOutlineQuestionCircle fill="var(--secondary-2)" />
                    </Tooltip>
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
                    "Próximo"
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
                <h1>Muito bom! Exame já cadastrado.</h1>
                <p>
                  Agora, caso queira, temos mais algumas informações opcionais
                </p>
              </div>
              <form onSubmit={updateExam} id="update">
                <div className={styles.row}>
                  <div className={styles.field}>
                    <Input
                      ref={subtitleInputRef}
                      className={styles.styledInput}
                      underlined
                      labelPlaceholder="Subtitulo do exame"
                      type="text"
                      aria-label="subtitle-input"
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <Input
                      ref={levelInputRef}
                      className={styles.styledInput}
                      underlined
                      labelPlaceholder="Nível do exame"
                      type="text"
                      aria-label="level-input"
                    />
                  </div>
                  <div className={styles.field}>
                    <Input
                      ref={dateToArchiveInputRef}
                      className={styles.styledInput}
                      underlined
                      label="Data para arquivar o exame"
                      type="date"
                      aria-label="date-to-archive-input"
                    />
                    <Tooltip
                      className={styles.tooltip}
                      content={
                        "Caso pretenda arquivar o exame para não receber mais respostas, selecione uma data."
                      }
                    >
                      <AiOutlineQuestionCircle fill="var(--secondary-2)" />
                    </Tooltip>
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
                    <p>O exame é público?</p>
                    <Switch
                      checked={isPublic}
                      onChange={() => setIsPublic((prevState) => !prevState)}
                      size="md"
                    />
                  </div>
                </div>
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
                    "Finalizar"
                  )}
                </button>
              </form>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              className={styles.motionDiv}
              variants={stepTwoDropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.finishingView}>
                <div>
                  <div className={styles.intro}>
                    <h1>Perfeito! Exame já criado!.</h1>
                    <p>
                      O que acha da gente começar a criar a sessões do seu
                      exame?
                    </p>
                  </div>
                  <div className={styles.actions}>
                    <Link href={`/exams`}>Meus exames</Link>
                    <Link
                      href={`/exams/${examId}`}
                      className={styles.principalBtn}
                    >
                      Ver exame criado
                    </Link>
                  </div>
                </div>
                <div className={styles.lottie}>{View}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateExam;
