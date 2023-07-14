import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });

import examService from "@/services/examService";
import sectionService from "@/services/sectionService";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import styles from "./styles.module.scss";

const fetchSectionName = async (
  sectionId: string,
  setSectionName: (sectionName: string) => void
) => {
  const response = await sectionService.getOwnSection(sectionId);

  if (response) {
    const { name } = response.data;

    localStorage.setItem("exameName", name);

    setSectionName(name);
  }
};

const fetchExameName = async (
  examId: string,
  setExamName: (examName: string) => void
) => {
  const response = await examService.getOwnExam(examId);

  if (response) {
    const { title, subtitle, level } = response.data;

    const exameName = title + " " + subtitle + " - " + level;

    localStorage.setItem("exameName", exameName);

    setExamName(exameName);
  }
};

const ManualCreator = () => {
  const [exameName, setExameName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [questionType, setQuestionType] = useState<
    "challenge" | "programming" | "multipleChoice" | "text" | ""
  >("");
  const [statement, setStatement] = useState("");

  const [options, setOptions] = useState<
    {
      option: string;
      isCorrect: boolean;
    }[]
  >([
    {
      option: "",
      isCorrect: true,
    },
    {
      option: "",
      isCorrect: false,
    },
    {
      option: "",
      isCorrect: false,
    },
    {
      option: "",
      isCorrect: false,
    },
    {
      option: "",
      isCorrect: false,
    },
  ]);

  const [textAnswer, setTextAnswer] = useState("");

  const router = useRouter();

  useEffect(() => {
    const exameName = localStorage.getItem("exameName");
    const sectionName = localStorage.getItem("sectionName");
    const examId = router.query.examId;
    const sectionId = router.query.sectionId;

    if (examId && typeof examId === "string") {
      if (exameName) {
        setExameName(exameName);
      } else {
        fetchExameName(examId, setExameName);
      }
    }

    if (sectionId && typeof sectionId === "string") {
      if (sectionName) {
        setSectionName(sectionName);
      } else {
        fetchSectionName(sectionId, setSectionName);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Nova questão para sessão.</h1>
        <p>
          Preencha todos os campos obrigatórios para criar uma nova questão.
        </p>
      </div>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div>
            <h3>Exame</h3>
            <p>{exameName}</p>
          </div>
          <div>
            <h3>Sessão</h3>
            <p>{sectionName}</p>
          </div>
          <div>
            <h3>Tipo da questão</h3>
            <select
              name="questionType"
              id="questionType"
              onChange={(e) => {
                setQuestionType(
                  e.target.value as
                    | "challenge"
                    | "programming"
                    | "multipleChoice"
                    | "text"
                    | ""
                );
              }}
            >
              <option value="">Selecione um tipo</option>
              <option value="challenge">Desafio</option>
              <option value="programming">Programação</option>
              <option value="multipleChoice">Múltipla escolha</option>
              <option value="text">Texto</option>
            </select>
          </div>
        </div>
        <div className={styles.contentBody}>
          <div className={styles.statement}>
            <h3>Enunciado</h3>
            <ReactQuill
              theme="snow"
              value={statement}
              onChange={setStatement}
              style={{ height: "120px" }}
              placeholder="Digite o enunciado da questão aqui..."
            />
          </div>
          <div className={styles.answers}>
            {questionType === "multipleChoice" && (
              <>
                <h3>Alternativas</h3>
                <div className={styles.option}>
                  <h4>Alternativa correta</h4>
                  <ReactQuill
                    className={styles.optionInput}
                    theme="bubble"
                    value={options[0].option}
                    onChange={(value) => {
                      setOptions((oldOptions) => {
                        const newOptions = [...oldOptions];
                        newOptions[0].option = value;
                        return newOptions;
                      });
                    }}
                    style={{
                      height: "120px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                    placeholder="Digite a alternativa correta aqui..."
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.option}>
                    <h4>Alternativa Errada 1</h4>
                    <ReactQuill
                      theme="bubble"
                      value={options[1].option}
                      onChange={(value) => {
                        setOptions((oldOptions) => {
                          const newOptions = [...oldOptions];
                          newOptions[1].option = value;
                          return newOptions;
                        });
                      }}
                      style={{
                        height: "120px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      placeholder="Digite uma das alternativa erradas aqui..."
                    />
                  </div>
                  <div className={styles.option}>
                    <h4>Alternativa Errada 2</h4>
                    <ReactQuill
                      theme="bubble"
                      value={options[2].option}
                      onChange={(value) => {
                        setOptions((oldOptions) => {
                          const newOptions = [...oldOptions];
                          newOptions[2].option = value;
                          return newOptions;
                        });
                      }}
                      style={{
                        height: "120px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      placeholder="Digite uma das alternativa erradas aqui..."
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.option}>
                    <h4>Alternativa Errada 3</h4>
                    <ReactQuill
                      theme="bubble"
                      value={options[3].option}
                      onChange={(value) => {
                        setOptions((oldOptions) => {
                          const newOptions = [...oldOptions];
                          newOptions[3].option = value;
                          return newOptions;
                        });
                      }}
                      style={{
                        height: "120px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      placeholder="Digite uma das alternativa erradas aqui..."
                    />
                  </div>
                  <div className={styles.option}>
                    <h4>Alternativa Errada 4</h4>
                    <ReactQuill
                      theme="bubble"
                      value={options[4].option}
                      onChange={(value) => {
                        setOptions((oldOptions) => {
                          const newOptions = [...oldOptions];
                          newOptions[4].option = value;
                          return newOptions;
                        });
                      }}
                      style={{
                        height: "120px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      placeholder="Digite uma das alternativa erradas aqui..."
                    />
                  </div>
                </div>
              </>
            )}
            {questionType === "programming" && (
              <>
                <h3>Resposta esperada</h3>
              </>
            )}
            {questionType === "challenge" && (
              <>
                <h3>Resposta esperada</h3>
              </>
            )}
            {questionType === "text" && (
              <>
                <h3>Resposta esperada</h3>
                <ReactQuill
                  className={styles.optionInput}
                  theme="bubble"
                  value={textAnswer}
                  onChange={setTextAnswer}
                  style={{
                    height: "120px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                  placeholder="Digite a resposta esperada aqui..."
                />
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ManualCreator;
