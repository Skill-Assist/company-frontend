import { useEffect, useState, useRef, FC } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import CreatableSelect from "react-select/creatable";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

import examService from "@/services/examService";
import sectionService from "@/services/sectionService";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import styles from "./styles.module.scss";
import { Option } from "@/types/option";
import { Question } from "@/types/question";
import { toast } from "react-hot-toast";
import questionService from "@/services/questionService";

const fetchSectionName = async (
  sectionId: string,
  setSectionName: (sectionName: string) => void
) => {
  const response = await sectionService.getOwnSection(sectionId);

  if (response.status >= 200 && response.status < 300) {
    const { name } = response.data;

    localStorage.setItem("exameName", name);

    setSectionName(name);
  } else {
    toast.error("Erro ao buscar nome da sessão.");
  }
};

const fetchExameName = async (
  examId: string,
  setExamName: (examName: string) => void
) => {
  const response = await examService.getOwnExam(examId);

  if (response.status >= 200 && response.status < 300) {
    const { title, subtitle, level } = response.data;

    const exameName = title + " " + subtitle + " - " + level;

    localStorage.setItem("exameName", exameName);

    setExamName(exameName);
  } else {
    toast.error("Erro ao buscar nome do exame.");
  }
};

interface selectOption {
  value: string;
  label: string;
}

interface Props {
  close: () => void;
  fetchQuestions: (_id: string) => Promise<void>;
}

const ManualCreator: FC<Props> = ({ close, fetchQuestions }: Props) => {
  const [exameName, setExameName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [questionType, setQuestionType] = useState<
    "challenge" | "programming" | "multipleChoice" | "text" | ""
  >("");
  const [statement, setStatement] = useState("");

  const [options, setOptions] = useState<Option>({
    "1": "",
    "2": "",
  });

  const addOptionHandler = () => {
    setOptions((oldOptions) => {
      const newOptions = { ...oldOptions };
      newOptions[Object.keys(oldOptions).length + 1] = "";
      return newOptions;
    });
  };

  const [correctOption, setCorrectOption] = useState({
    answer: { option: "" },
  });

  const [defaultTags, setDefaultTags] = useState<selectOption[]>([
    {
      value: "multipla-escolha",
      label: "Múltipla escolha",
    },
    {
      value: "desafio",
      label: "Desafio",
    },
    {
      value: "programacao",
      label: "Programação",
    },
    {
      value: "texto",
      label: "Texto",
    },
  ]);

  const [tags, setTags] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [difficulty, setDifficulty] = useState(2.5);
  const [isShareable, setIsShareable] = useState(true);
  const weightInputRef = useRef<HTMLInputElement>(null);

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

  const handleCreateQuestion = async () => {
    const sectionId = router.query.sectionId;
    const enteredWeight = weightInputRef.current?.value;

    if (!sectionId || typeof sectionId !== "string") {
      return;
    }

    if (!enteredWeight) {
      toast.error("Preencha o peso da questão.");
      return;
    }

    let questionData: Question = {
      type: questionType,
      statement,
      // tags: ["tag-test"],
      difficulty,
      isShareable,
      gradingRubric: {},
    };

    if (questionType === "multipleChoice") {
      questionData = {
        ...questionData,
        options: options,
        gradingRubric: correctOption,
      };
    }

    const response = await questionService
      .createQuestion(questionData, sectionId, +enteredWeight)
      .then((res) => {
        fetchQuestions(res.data._id);
      })
      .then(() => {
        close();
      });
  };

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
          <div>
            <h3>Peso da questão</h3>
            <input
              ref={weightInputRef}
              type="number"
              min={1}
              placeholder="0.0"
            />
          </div>
        </div>
        <div className={styles.contentBody}>
          <div className={styles.contentBox} style={{ height: "200px" }}>
            <h3>Enunciado</h3>
            <ReactQuill
              theme="snow"
              value={statement}
              onChange={setStatement}
              style={{ height: "120px" }}
              placeholder="Digite o enunciado da questão aqui..."
            />
          </div>
          <div
            className={styles.answers}
            style={{ display: questionType === "" ? "none" : "flex" }}
          >
            {questionType === "multipleChoice" && (
              <>
                <div className={styles.multipleChoiceHeader}>
                  <h3>Alternativas</h3>
                  <p onClick={() => console.log(correctOption)}>
                    Marque a alternativa correta
                  </p>
                </div>
                {Object.keys(options).map((option, index) => {
                  return (
                    <div className={styles.option} key={index}>
                      <label className={styles.checkboxContainer}>
                        <input
                          type="checkbox"
                          name="check"
                          id="check"
                          checked={correctOption.answer.option === option}
                          onChange={(e) => {
                            setCorrectOption({
                              answer: {
                                option: e.target.checked ? option  : "",
                              },
                            })
                          }}
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                      <input
                        onChange={(e) => {
                          setOptions((oldOptions) => {
                            const newOptions = { ...oldOptions };
                            newOptions[option] = e.target.value;
                            return newOptions;
                          });
                        }}
                        placeholder="Digite uma das alternativa aqui..."
                      />
                    </div>
                  );
                })}
                <button onClick={addOptionHandler}>
                  Adicionar alternativa
                </button>
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
          <div className={styles.contentBox}>
            <h3>Tags</h3>
            <CreatableSelect
              isMulti
              isClearable
              placeholder="Selecione as tags"
              styles={{
                control: (provided) => ({
                  ...provided,
                  boxShadow: "none",
                }),
                option: (provided) => ({
                  ...provided,
                  cursor: "pointer",
                }),
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "var(--primary-2)",
                  primary: "var(--primary-2)",
                },
              })}
              components={animatedComponents}
              options={defaultTags}
              onChange={(value) => {
                if (value) {
                  setTags(value.map((tag: any) => tag.value));
                } else {
                  setTags([]);
                }
              }}
            />
          </div>
          <div className={styles.footer}>
            <div>
              <h4>Nível de Dificuldade</h4>
              <input
                type="number"
                name="difficulty"
                id="difficulty"
                min={1}
                max={5}
                defaultValue={difficulty}
                onChange={(e) => {
                  setDifficulty(Number(e.target.value));
                }}
              />
            </div>
            <div>
              <h4>Compartilhavel?</h4>
              <select
                name="shareable"
                id="shareable"
                onChange={(e) => {
                  setIsShareable(e.target.value === "true" ? true : false);
                }}
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancel}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleCreateQuestion}
            className={styles.submit}
          >
            Criar questão
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualCreator;
