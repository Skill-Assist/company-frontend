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
  fetchQuestions: (_id: string) => Promise<void>;
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
  const weightInputRef = useRef<HTMLInputElement>(null);
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

  const totalPointsInputRef = useRef<HTMLInputElement>(null);
  const greatGradeTextInputRef = useRef<HTMLInputElement>(null);
  const greatMaxInputRef = useRef<HTMLInputElement>(null);
  const avaregeGradeTextInputRef = useRef<HTMLInputElement>(null);
  const avarageMinInputRef = useRef<HTMLInputElement>(null);
  const avarageMaxInputRef = useRef<HTMLInputElement>(null);
  const badGradeTextInputRef = useRef<HTMLInputElement>(null);
  const badMinInputRef = useRef<HTMLInputElement>(null);
  const badMaxInputRef = useRef<HTMLInputElement>(null);

  const saveGradingRubricHandler = (name: string) => {
    setSavingGradingRubricLoading(true);
    const totalPoints = totalPointsInputRef.current?.value;
    const greatGradeText = greatGradeTextInputRef.current?.value;
    const greatMax = greatMaxInputRef.current?.value;
    const avaregeGradeText = avaregeGradeTextInputRef.current?.value;
    const avarageMin = avarageMinInputRef.current?.value;
    const avarageMax = avarageMaxInputRef.current?.value;
    const badGradeText = badGradeTextInputRef.current?.value;
    const badMin = badMinInputRef.current?.value;
    const badMax = badMaxInputRef.current?.value;

    if (
      !totalPoints ||
      !greatGradeText ||
      !greatMax ||
      !avaregeGradeText ||
      !avarageMin ||
      !avarageMax ||
      !badGradeText ||
      !badMin ||
      !badMax
    ) {
      toast.error("Preencha todos os campos.");
      setTimeout(() => {
        setSavingGradingRubricLoading(false);
      }, 1000);
      return;
    }

    const newCriteria: Criteria = {
      total_points: +totalPoints,
      [greatGradeText]: +greatMax,
      [avaregeGradeText]: { min: +avarageMin, max: +avarageMax },
      [badGradeText]: { min: +badMin, max: +badMax },
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
    } else if (questionType === "text") {
      questionData = {
        ...questionData,
        gradingRubric: gradingRubric,
      };
    }

    const response = await questionService.createQuestion(
      questionData,
      sectionId,
      +enteredWeight
    );

    if (response.status >= 200 && response.status < 300) {
      toast.success("Questão criada com sucesso.");
      fetchQuestions(response.data._id);
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
                <h3
                  onClick={() => {
                    console.log(gradingRubric);
                  }}
                >
                  Critérios de correção
                </h3>
                <div className={styles.gradingRubricInput}>
                  <div>
                    <label htmlFor="gradingRubric">Nome do critério</label>
                    <input
                      type="text"
                      name="gradingRubric"
                      id="gradingRubric"
                      placeholder="Digite o nome do critério aqui..."
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
                          <label htmlFor="total-points">Peso do critério</label>
                          <input
                            type="number"
                            name="total-points"
                            id="total-points"
                            ref={totalPointsInputRef}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor="great-grade-text">Nota máxima</label>
                          <input
                            type="text"
                            name="great-grade-text"
                            id="great-grade-text"
                            placeholder="Descreva como alcançar a nota máxima aqui..."
                            ref={greatGradeTextInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="greatMax"
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input
                            type="number"
                            id="greatMax"
                            ref={greatMaxInputRef}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor="avarege-grade-text">Nota média</label>
                          <input
                            type="text"
                            name="avarege-grade-text"
                            id="avarege-grade-text"
                            placeholder="Descreva como alcançar a nota média aqui..."
                            ref={avaregeGradeTextInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="avarageMin"
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input
                            type="number"
                            id="avarageMin"
                            ref={avarageMinInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="avarageMax"
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input
                            type="number"
                            id="avarageMax"
                            ref={avarageMaxInputRef}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor="bad-grade-text">Nota ruim</label>
                          <input
                            type="text"
                            name="bad-grade-text"
                            id="bad-grade-text"
                            placeholder="Descreva como alcançar a pior nota aqui..."
                            ref={badGradeTextInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="badMin"
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input
                            type="number"
                            id="badMin"
                            ref={badMinInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="badMax"
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input
                            type="number"
                            id="badMax"
                            ref={badMaxInputRef}
                          />
                        </div>
                      </div>

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
                    </form>
                  ))}
                </div>
              </div>
            )}
            {questionType === "challenge" && (
              <div className={styles.gradingRubricContainer}>
                <h3
                  onClick={() => {
                    console.log(gradingRubric);
                  }}
                >
                  Critérios de correção
                </h3>
                <div className={styles.gradingRubricInput}>
                  <div>
                    <label htmlFor="gradingRubric">Nome do critério</label>
                    <input
                      type="text"
                      name="gradingRubric"
                      id="gradingRubric"
                      placeholder="Digite o nome do critério aqui..."
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
                          <label htmlFor="total-points">Peso do critério</label>
                          <input
                            type="number"
                            name="total-points"
                            id="total-points"
                            ref={totalPointsInputRef}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor="great-grade-text">Nota máxima</label>
                          <input
                            type="text"
                            name="great-grade-text"
                            id="great-grade-text"
                            placeholder="Descreva como alcançar a nota máxima aqui..."
                            ref={greatGradeTextInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="greatMax"
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input
                            type="number"
                            id="greatMax"
                            ref={greatMaxInputRef}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor="avarege-grade-text">Nota média</label>
                          <input
                            type="text"
                            name="avarege-grade-text"
                            id="avarege-grade-text"
                            placeholder="Descreva como alcançar a nota média aqui..."
                            ref={avaregeGradeTextInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="avarageMin"
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input
                            type="number"
                            id="avarageMin"
                            ref={avarageMinInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="avarageMax"
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input
                            type="number"
                            id="avarageMax"
                            ref={avarageMaxInputRef}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor="bad-grade-text">Nota ruim</label>
                          <input
                            type="text"
                            name="bad-grade-text"
                            id="bad-grade-text"
                            placeholder="Descreva como alcançar a pior nota aqui..."
                            ref={badGradeTextInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="badMin"
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input
                            type="number"
                            id="badMin"
                            ref={badMinInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="badMax"
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input
                            type="number"
                            id="badMax"
                            ref={badMaxInputRef}
                          />
                        </div>
                      </div>

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
                    </form>
                  ))}
                </div>
              </div>
            )}
            {questionType === "text" && (
              <div className={styles.gradingRubricContainer}>
                <h3
                  onClick={() => {
                    console.log(gradingRubric);
                  }}
                >
                  Critérios de correção
                </h3>
                <div className={styles.gradingRubricInput}>
                  <div>
                    <label htmlFor="gradingRubric">Nome do critério</label>
                    <input
                      type="text"
                      name="gradingRubric"
                      id="gradingRubric"
                      placeholder="Digite o nome do critério aqui..."
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
                          <label htmlFor="total-points">Peso do critério</label>
                          <input
                            type="number"
                            name="total-points"
                            id="total-points"
                            ref={totalPointsInputRef}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor="great-grade-text">Nota máxima</label>
                          <input
                            type="text"
                            name="great-grade-text"
                            id="great-grade-text"
                            placeholder="Descreva como alcançar a nota máxima aqui..."
                            ref={greatGradeTextInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="greatMax"
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input
                            type="number"
                            id="greatMax"
                            ref={greatMaxInputRef}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor="avarege-grade-text">Nota média</label>
                          <input
                            type="text"
                            name="avarege-grade-text"
                            id="avarege-grade-text"
                            placeholder="Descreva como alcançar a nota média aqui..."
                            ref={avaregeGradeTextInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="avarageMin"
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input
                            type="number"
                            id="avarageMin"
                            ref={avarageMinInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="avarageMax"
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input
                            type="number"
                            id="avarageMax"
                            ref={avarageMaxInputRef}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaInput}>
                          <label htmlFor="bad-grade-text">Nota ruim</label>
                          <input
                            type="text"
                            name="bad-grade-text"
                            id="bad-grade-text"
                            placeholder="Descreva como alcançar a pior nota aqui..."
                            ref={badGradeTextInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="badMin"
                            style={{ color: "var(--warning)" }}
                          >
                            Min
                          </label>
                          <input
                            type="number"
                            id="badMin"
                            ref={badMinInputRef}
                          />
                        </div>
                        <div className={styles.criteriaValues}>
                          <label
                            htmlFor="badMax"
                            style={{ color: "var(--primary-2)" }}
                          >
                            Max
                          </label>
                          <input
                            type="number"
                            id="badMax"
                            ref={badMaxInputRef}
                          />
                        </div>
                      </div>

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
                    </form>
                  ))}
                </div>
              </div>
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
