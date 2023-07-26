import { useEffect, useState, useRef, FC, FormEvent } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import CreatableSelect from "react-select/creatable";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

import examService from "@/services/examService";
import sectionService from "@/services/sectionService";
import questionService from "@/services/questionService";

import { Option } from "@/types/option";
import { Question } from "@/types/question";

import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";
import styles from "./styles.module.scss";
import { ThreeDots } from "react-loader-spinner";

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
  fetchQuestions: () => Promise<void>;
}

interface Criteria {
  total_points: number | null;
  [key: string]: number | null | { min: number | null; max: number | null };
}

interface CriteriaObject {
  [key: string]: Criteria;
}

const ManualCreator: FC<Props> = ({ close, fetchQuestions }: Props) => {
  const [exameName, setExameName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [questionType, setQuestionType] = useState<
    "challenge" | "programming" | "multipleChoice" | "text" | ""
  >("");
  const [questionWeight, setQuestionWeight] = useState<1 | 2 | 3 | "">("");
  const [statement, setStatement] = useState("");

  // Multiple Choice Variables and Logic

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

  // End of Multiple Choice Variables and Logic

  // Grading Rubric Variables and Logic
  const [savingGradingRubricLoading, setSavingGradingRubricLoading] =
    useState(false);
  const [gradingRubricNames, setGradingRubricNames] = useState<string[]>([]);
  const gradingRubricNameInputRef = useRef<HTMLInputElement>(null);

  const [gradingRubric, setGradingRubric] = useState<CriteriaObject>({});

  const saveGradingRubricHandler = (name: string) => {
    setSavingGradingRubricLoading(true);
    const totalPoints = document.getElementById(
      `total-points-${name}`
    ) as HTMLInputElement;
    const greatGradeText = document.getElementById(
      `great-grade-text-${name}`
    ) as HTMLInputElement;
    const greatMax = document.getElementById(
      `great-max-${name}`
    ) as HTMLInputElement;
    const avaregeGradeText = document.getElementById(
      `avarage-grade-text-${name}`
    ) as HTMLInputElement;
    const avarageMin = document.getElementById(
      `avarage-min-${name}`
    ) as HTMLInputElement;
    const avarageMax = document.getElementById(
      `avarage-max-${name}`
    ) as HTMLInputElement;
    const badGradeText = document.getElementById(
      `bad-grade-text-${name}`
    ) as HTMLInputElement;
    const badMin = document.getElementById(
      `bad-min-${name}`
    ) as HTMLInputElement;
    const badMax = document.getElementById(
      `bad-max-${name}`
    ) as HTMLInputElement;

    if (
      !totalPoints.value ||
      !greatGradeText.value ||
      !greatMax.value ||
      !avaregeGradeText.value ||
      !avarageMin.value ||
      !avarageMax.value ||
      !badGradeText.value ||
      !badMin.value ||
      !badMax.value
    ) {
      toast.error("Preencha todos os campos.");
      setTimeout(() => {
        setSavingGradingRubricLoading(false);
      }, 1000);
      return;
    }

    const newCriteria: Criteria = {
      total_points: +totalPoints.value,
      [greatGradeText.value]: +greatMax.value,
      [avaregeGradeText.value]: {
        min: +avarageMin.value,
        max: +avarageMax.value,
      },
      [badGradeText.value]: { min: +badMin.value, max: +badMax.value },
    };

    setGradingRubric((oldGradingRubric) => {
      const newGradingRubric = { ...oldGradingRubric };
      newGradingRubric[name] = newCriteria;
      return newGradingRubric;
    });

    setTimeout(() => {
      setSavingGradingRubricLoading(false);
    }, 1000);

    toast.success("Critério de correção salvo com sucesso.");
  };

  const gradingRubricNameHandler = () => {
    if (
      gradingRubricNameInputRef.current &&
      gradingRubricNameInputRef.current.value !== ""
    ) {
      setGradingRubricNames((oldNames) => {
        const newNames = [...oldNames];
        const existingName = newNames.find(
          (name) => name === gradingRubricNameInputRef.current!.value
        );

        if (!existingName) {
          newNames.push(gradingRubricNameInputRef.current!.value);
          return newNames;
        } else {
          toast.error(
            `${gradingRubricNameInputRef.current!.value} já foi adicionado.`
          );
          return oldNames;
        }
      });
    }
  };

  const deletegradingRubricNameHandler = (name: string) => {
    setGradingRubricNames((oldNames) => {
      const newNames = [...oldNames];
      const index = newNames.findIndex((n) => n === name);
      newNames.splice(index, 1);
      return newNames;
    });
  };

  // End of Grading Rubric Variables and Logic

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

  const [difficulty, setDifficulty] = useState(2.5);
  const [isShareable, setIsShareable] = useState(true);

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

    if (!sectionId || typeof sectionId !== "string") {
      return;
    }

    if (questionWeight === "") {
      toast.error("Preencha o peso da questão.");
      return;
    }

    let questionData: Question = {
      type: questionType,
      statement,
      tags,
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
    } else if (
      questionType === "text" ||
      questionType === "challenge" ||
      questionType === "programming"
    ) {
      questionData = {
        ...questionData,
        gradingRubric: gradingRubric,
      };
    }

    console.log("gradingRubric", gradingRubric);
    console.log("questionData", questionData);

    const response = await questionService.createQuestion(
      questionData,
      sectionId,
      +questionWeight
    );

    if (response.status >= 200 && response.status < 300) {
      toast.success("Questão criada com sucesso.");
      fetchQuestions();
      close();
    } else {
      toast.error("Erro ao criar questão.");
    }
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
            <select
              name="questionWeight"
              id="questionWeight"
              onChange={(e) => {
                setQuestionWeight(e.target.value as 1 | 2 | 3 | "");
              }}
            >
              <option value="">Peso da questão</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
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
          <div className={styles.contentBox}>
            <h3 onClick={() => console.log(gradingRubricNames)}>Tags</h3>
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
                  primary25: "var(--neutral-50)",
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
          <div className={styles.optionalInfos}>
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
          <div style={{ display: questionType === "" ? "none" : "flex" }}>
            {questionType === "multipleChoice" && (
              <div className={styles.multipleChoiceContainer}>
                <div className={styles.multipleChoiceHeader}>
                  <h3>Alternativas</h3>
                  <p>Marque a alternativa correta</p>
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
                                option: e.target.checked ? option : "",
                              },
                            });
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
              </div>
            )}
            {questionType === "programming" && (
              <div className={styles.gradingRubricContainer}>
                <h3>Critérios de correção</h3>
                <div className={styles.gradingRubricInput}>
                  <div>
                    <label htmlFor="gradingRubric">Nome do critério</label>
                    <input
                      type="text"
                      name="gradingRubric"
                      id="gradingRubric"
                      placeholder='Por exemplo: "Clean Code", "Deploy", "Acurácia"'
                      ref={gradingRubricNameInputRef}
                    />
                  </div>
                  <button type="button" onClick={gradingRubricNameHandler}>
                    Adicionar
                  </button>
                </div>
                <div className={styles.gradingRubricTable}>
                  {gradingRubricNames.reverse().map((name, index) => (
                    <form className={styles.gradingRubricCard} key={index}>
                      <div className={styles.cardHeader}>
                        <h3>{name}</h3>
                        <div>
                          <label htmlFor={`total-points-${name}`}>
                            Peso do critério
                          </label>
                          <input
                            type="number"
                            name="total-points"
                            id={`total-points-${name}`}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor={`great-grade-text-${name}`}>
                            Nota máxima
                          </label>
                          <input
                            type="text"
                            name="great-grade-text"
                            id={`great-grade-text-${name}`}
                            placeholder="Por exemplo '...'"
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`great-max-${name}`}
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input type="number" id={`great-max-${name}`} />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor={`avarage-grade-text-${name}`}>
                            Nota média
                          </label>
                          <input
                            type="text"
                            name="avarege-grade-text"
                            id={`avarage-grade-text-${name}`}
                            placeholder="Por exemplo '...'"
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`avarage-min-${name}`}
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input type="number" id={`avarage-min-${name}`} />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`avarage-max-${name}`}
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input type="number" id={`avarage-max-${name}`} />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor={`bad-grade-text-${name}`}>
                            Nota ruim
                          </label>
                          <input
                            type="text"
                            name="bad-grade-text"
                            id={`bad-grade-text-${name}`}
                            placeholder="Por exemplo '...'"
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`bad-min-${name}`}
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input type="number" id={`bad-min-${name}`} />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`bad-max-${name}`}
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input type="number" id={`bad-max-${name}`} />
                        </div>
                      </div>

                      <div className={styles.gradingRubricActions}>
                        <button
                          type="button"
                          onClick={() => deletegradingRubricNameHandler(name)}
                        >
                          Deletar critério de correção
                        </button>

                        <button
                          type="button"
                          onClick={() => saveGradingRubricHandler(name)}
                        >
                          {savingGradingRubricLoading ? (
                            <ThreeDots
                              color="var(--neutral-0)"
                              height={20}
                              width={20}
                            />
                          ) : (
                            "Salvar critério de correção"
                          )}
                        </button>
                      </div>
                    </form>
                  ))}
                </div>
                <div className={styles.techOptions}>
                  <h3>Runtimes:</h3>
                  <ul>
                    <li>
                      <label className={styles.checkboxContainer}>
                        <input type="checkbox" name="option1" id="option1" />
                        <span className={styles.checkmark}></span>
                      </label>
                      <label htmlFor="option1">Javascript</label>
                    </li>
                    <li>
                      <label className={styles.checkboxContainer}>
                        <input type="checkbox" name="option2" id="option2" />
                        <span className={styles.checkmark}></span>
                      </label>
                      <label htmlFor="option2">Python</label>
                    </li>
                    <li>
                      <label className={styles.checkboxContainer}>
                        <input type="checkbox" name="option3" id="option3" />
                        <span className={styles.checkmark}></span>
                      </label>
                      <label htmlFor="option3">C++</label>
                    </li>
                    {/* <li>
                        <label className={styles.checkboxContainer}>
                          <input type="checkbox" name="option4" id="option4" />
                          <span className={styles.checkmark}></span>
                        </label>
                        <label htmlFor="option4">Python</label>
                      </li> */}
                  </ul>
                </div>
              </div>
            )}
            {questionType === "challenge" && (
              <div className={styles.gradingRubricContainer}>
                <h3>Critérios de correção</h3>
                <div className={styles.gradingRubricInput}>
                  <div>
                    <label htmlFor="gradingRubric">Nome do critério</label>
                    <input
                      type="text"
                      name="gradingRubric"
                      id="gradingRubric"
                      placeholder='Por exemplo: "Clean Code", "Deploy", "Acurácia"'
                      ref={gradingRubricNameInputRef}
                    />
                  </div>
                  <button type="button" onClick={gradingRubricNameHandler}>
                    Adicionar
                  </button>
                </div>
                <div className={styles.gradingRubricTable}>
                  {gradingRubricNames.reverse().map((name, index) => (
                    <form className={styles.gradingRubricCard} key={index}>
                      <div className={styles.cardHeader}>
                        <h3>{name}</h3>
                        <div>
                          <label htmlFor={`total-points-${name}`}>
                            Peso do critério
                          </label>
                          <input
                            type="number"
                            name="total-points"
                            id={`total-points-${name}`}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor={`great-grade-text-${name}`}>
                            Nota máxima
                          </label>
                          <input
                            type="text"
                            name="great-grade-text"
                            id={`great-grade-text-${name}`}
                            placeholder="Por exemplo '...'"
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`great-max-${name}`}
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input type="number" id={`great-max-${name}`} />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor={`avarage-grade-text-${name}`}>
                            Nota média
                          </label>
                          <input
                            type="text"
                            name="avarege-grade-text"
                            id={`avarage-grade-text-${name}`}
                            placeholder="Por exemplo '...'"
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`avarage-min-${name}`}
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input type="number" id={`avarage-min-${name}`} />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`avarage-max-${name}`}
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input type="number" id={`avarage-max-${name}`} />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor={`bad-grade-text-${name}`}>
                            Nota ruim
                          </label>
                          <input
                            type="text"
                            name="bad-grade-text"
                            id={`bad-grade-text-${name}`}
                            placeholder="Por exemplo '...'"
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`bad-min-${name}`}
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input type="number" id={`bad-min-${name}`} />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor={`bad-max-${name}`}
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input type="number" id={`bad-max-${name}`} />
                        </div>
                      </div>

                      <div className={styles.gradingRubricActions}>
                        <button
                          type="button"
                          onClick={() => deletegradingRubricNameHandler(name)}
                        >
                          Deletar critério de correção
                        </button>

                        <button
                          type="button"
                          onClick={() => saveGradingRubricHandler(name)}
                        >
                          {savingGradingRubricLoading ? (
                            <ThreeDots
                              color="var(--neutral-0)"
                              height={20}
                              width={20}
                            />
                          ) : (
                            "Salvar critério de correção"
                          )}
                        </button>
                      </div>
                    </form>
                  ))}
                </div>
                <div className={styles.techOptions}>
                  <h3>Runtimes:</h3>
                  <ul>
                    <li>
                      <label className={styles.checkboxContainer}>
                        <input type="checkbox" name="option1" id="option1" />
                        <span className={styles.checkmark}></span>
                      </label>
                      <label htmlFor="option1">Node</label>
                    </li>
                    <li>
                      <label className={styles.checkboxContainer}>
                        <input type="checkbox" name="option2" id="option2" />
                        <span className={styles.checkmark}></span>
                      </label>
                      <label htmlFor="option2">Nginx</label>
                    </li>
                    <li>
                      <label className={styles.checkboxContainer}>
                        <input type="checkbox" name="option3" id="option3" />
                        <span className={styles.checkmark}></span>
                      </label>
                      <label htmlFor="option3">Laravel</label>
                    </li>
                    <li>
                      <label className={styles.checkboxContainer}>
                        <input type="checkbox" name="option4" id="option4" />
                        <span className={styles.checkmark}></span>
                      </label>
                      <label htmlFor="option4">Python</label>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {questionType === "text" && (
              <>
                <div className={styles.gradingRubricContainer}>
                  <h3>Critérios de correção</h3>
                  <div className={styles.gradingRubricInput}>
                    <div>
                      <label htmlFor="gradingRubric">Nome do critério</label>
                      <input
                        type="text"
                        name="gradingRubric"
                        id="gradingRubric"
                        placeholder='Por exemplo: "Coerência e coesão", "Gramática", "Conteúdo"'
                        ref={gradingRubricNameInputRef}
                      />
                    </div>
                    <button type="button" onClick={gradingRubricNameHandler}>
                      Adicionar
                    </button>
                  </div>
                  <div className={styles.gradingRubricTable}>
                    {gradingRubricNames.reverse().map((name, index) => (
                      <form className={styles.gradingRubricCard} key={index}>
                        <div className={styles.cardHeader}>
                          <h3>{name}</h3>
                          <div>
                            <label htmlFor={`total-points-${name}`}>
                              Peso do critério
                            </label>
                            <input
                              type="number"
                              name="total-points"
                              id={`total-points-${name}`}
                            />
                          </div>
                        </div>

                        <div className={styles.criteriaContainer}>
                          <div className={styles.criteriaInput}>
                            <label htmlFor={`great-grade-text-${name}`}>
                              Nota máxima
                            </label>
                            <input
                              type="text"
                              name="great-grade-text"
                              id={`great-grade-text-${name}`}
                              placeholder="Por exemplo '...'"
                            />
                          </div>
                          <div className={styles.criteriaValues}>
                            <label
                              htmlFor={`great-max-${name}`}
                              style={{ color: "var(--primary-2)" }}
                            >
                              Max
                            </label>
                            <input type="number" id={`great-max-${name}`} />
                          </div>
                        </div>

                        <div className={styles.criteriaContainer}>
                          <div className={styles.criteriaInput}>
                            <label htmlFor={`avarage-grade-text-${name}`}>
                              Nota média
                            </label>
                            <input
                              type="text"
                              name="avarege-grade-text"
                              id={`avarage-grade-text-${name}`}
                              placeholder="Por exemplo '...'"
                            />
                          </div>
                          <div className={styles.criteriaValues}>
                            <label
                              htmlFor={`avarage-min-${name}`}
                              style={{ color: "var(--warning)" }}
                            >
                              Min
                            </label>
                            <input type="number" id={`avarage-min-${name}`} />
                          </div>
                          <div className={styles.criteriaValues}>
                            <label
                              htmlFor={`avarage-max-${name}`}
                              style={{ color: "var(--primary-2)" }}
                            >
                              Max
                            </label>
                            <input type="number" id={`avarage-max-${name}`} />
                          </div>
                        </div>

                        <div className={styles.criteriaContainer}>
                          <div className={styles.criteriaInput}>
                            <label htmlFor={`bad-grade-text-${name}`}>
                              Nota ruim
                            </label>
                            <input
                              type="text"
                              name="bad-grade-text"
                              id={`bad-grade-text-${name}`}
                              placeholder="Por exemplo '...'"
                            />
                          </div>
                          <div className={styles.criteriaValues}>
                            <label
                              htmlFor={`bad-min-${name}`}
                              style={{ color: "var(--warning)" }}
                            >
                              Min
                            </label>
                            <input type="number" id={`bad-min-${name}`} />
                          </div>
                          <div className={styles.criteriaValues}>
                            <label
                              htmlFor={`bad-max-${name}`}
                              style={{ color: "var(--primary-2)" }}
                            >
                              Max
                            </label>
                            <input type="number" id={`bad-max-${name}`} />
                          </div>
                        </div>

                        <div className={styles.gradingRubricActions}>
                          <button
                            type="button"
                            onClick={() => deletegradingRubricNameHandler(name)}
                          >
                            Deletar critério de correção
                          </button>

                          <button
                            type="button"
                            onClick={() => saveGradingRubricHandler(name)}
                          >
                            {savingGradingRubricLoading ? (
                              <ThreeDots
                                color="var(--neutral-0)"
                                height={20}
                                width={20}
                              />
                            ) : (
                              "Salvar critério de correção"
                            )}
                          </button>
                        </div>
                      </form>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <hr />
          <div>
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
    </div>
  );
};

export default ManualCreator;
