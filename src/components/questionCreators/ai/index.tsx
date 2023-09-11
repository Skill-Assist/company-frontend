import { useEffect, useState, useRef, FC, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import CreatableSelect from 'react-select/creatable';
const ReactQuill = dynamic(import('react-quill'), { ssr: false });
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import { AiFillCloseCircle } from 'react-icons/ai';

import examService from '@/services/examService';
import sectionService from '@/services/sectionService';
import questionService from '@/services/questionService';

import { GenerateQuestion } from '@/types/generatedQuestion';
import { GradingRubric } from '@/types/gradingRubric';
import { Option } from '@/types/option';
import { Question } from '@/types/question';

import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';
import styles from './styles.module.scss';

const fetchSectionName = async (
  sectionId: string,
  setSectionName: (sectionName: string) => void
) => {
  const response = await sectionService.getOwnSection(sectionId);

  if (response.status >= 200 && response.status < 300) {
    const { name } = response.data;

    localStorage.setItem('exameName', name);

    setSectionName(name);
  } else {
    toast.error('Erro ao buscar nome da seção.');
  }
};

const fetchExameName = async (
  examId: string,
  setExamName: (examName: string) => void
) => {
  const response = await examService.getOwnExam(examId);

  if (response.status >= 200 && response.status < 300) {
    const { title, subtitle, level } = response.data;

    const exameName = title + ' ' + subtitle + ' - ' + level;

    localStorage.setItem('exameName', exameName);

    setExamName(exameName);
  } else {
    toast.error('Erro ao buscar nome do exame.');
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

const AiCreator: FC<Props> = ({ close, fetchQuestions }: Props) => {
  const [exameName, setExameName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [questionType, setQuestionType] = useState<
    'challenge' | 'programming' | 'multiple-choice' | 'text' | ''
  >('');
  const [questionWeight, setQuestionWeight] = useState<1 | 2 | 3 | ''>('');
  const [statement, setStatement] = useState('');

  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GenerateQuestion>();

  const [generatedStatement, setGeneratedStatement] = useState('');

  // Multiple Choice Variables and Logic

  const [options, setOptions] = useState<Option>([
    {
      identifier: 'a',
      description: '',
    },
    {
      identifier: 'b',
      description: '',
    },
  ]);

  const addOptionHandler = () => {
    setOptions((oldOptions) => {
      const newOptions = [...oldOptions];

      const newIdentifier = String.fromCharCode(
        newOptions[newOptions.length - 1].identifier.charCodeAt(0) + 1
      );

      newOptions.push({
        identifier: newIdentifier,
        description: '',
      });

      return newOptions;
    });
  };

  const [correctOption, setCorrectOption] = useState({
    answer: { option: '' },
  });

  // End of Multiple Choice Variables and Logic

  // Grading Rubric Variables and Logic
  const gradingRubricNameInputRef = useRef<HTMLInputElement>(null);

  const [gradingRubric, setGradingRubric] = useState<GradingRubric>([]);

  const gradingRubricHandler = () => {
    const enteredCriteriaName = gradingRubricNameInputRef.current!.value;

    if (!enteredCriteriaName || enteredCriteriaName === '') {
      toast.error('Digite um nome para o critério de correção.');
      return;
    }

    const newCriteria = {
      criteria: {
        title: enteredCriteriaName,
        total_points: 0,
        maxValueCriteria: {
          description: '',
          value: {
            min: 0,
            max: 0,
          },
        },
        avgValueCriteria: {
          description: '',
          value: {
            min: 0,
            max: 0,
          },
        },
        minValueCriteria: {
          description: '',
          value: {
            min: 0,
            max: 0,
          },
        },
      },
    };

    setGradingRubric((oldGradingRubric) => [...oldGradingRubric, newCriteria]);

    gradingRubricNameInputRef.current!.value = '';
  };

  const deleteCriteria = (index: number) => {
    setGradingRubric((oldGradingRubric) => {
      const newGradingRubric = [...oldGradingRubric];
      newGradingRubric.splice(index, 1);
      return newGradingRubric;
    });
  };

  // End of Grading Rubric Variables and Logic

  const [defaultTags, setDefaultTags] = useState<selectOption[]>([
    {
      value: 'multipla-escolha',
      label: 'Múltipla escolha',
    },
    {
      value: 'desafio',
      label: 'Desafio',
    },
    {
      value: 'programacao',
      label: 'Programação',
    },
    {
      value: 'texto',
      label: 'Texto',
    },
  ]);

  const [tags, setTags] = useState<string[]>([]);

  const [difficulty, setDifficulty] = useState(2.5);
  const [isShareable, setIsShareable] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const exameName = localStorage.getItem('exameName');
    const sectionName = localStorage.getItem('sectionName');
    const examId = router.query.examId;
    const sectionId = router.query.sectionId;

    if (examId && typeof examId === 'string') {
      if (exameName) {
        setExameName(exameName);
      } else {
        fetchExameName(examId, setExameName);
      }
    }

    if (sectionId && typeof sectionId === 'string') {
      if (sectionName) {
        setSectionName(sectionName);
      } else {
        fetchSectionName(sectionId, setSectionName);
      }
    }
  }, [router]);

  const createQuestionHandler = async () => {
    const sectionId = router.query.sectionId;

    if (!sectionId || typeof sectionId !== 'string') {
      return;
    }

    if (questionWeight === '') {
      toast.error('Preencha o peso da questão.');
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

    if (questionType === 'multiple-choice') {
      questionData = {
        ...questionData,
        type: 'multipleChoice',
        options: options,
        gradingRubric: correctOption,
      };
    } else if (
      questionType === 'text' ||
      questionType === 'challenge' ||
      questionType === 'programming'
    ) {
      questionData = {
        ...questionData,
        gradingRubric: gradingRubric,
      };
    }

    const response = await questionService.createQuestion(
      questionData,
      sectionId,
      +questionWeight
    );

    if (response.status >= 200 && response.status < 300) {
      toast.success('Questão criada com sucesso.');
      fetchQuestions();
      close();
    } else {
      toast.error('Erro ao criar questão.');
    }
  };

  const questionGenerateHandler = async () => {
    if (generatedStatement === '') {
      toast.error('Preencha o campo de descrição.');
      return;
    }

    if (questionType === '') {
      toast.error('Selecione um tipo de questão.');
      return;
    }

    setGeneratingLoading(true);

    const body = {
      type: questionType,
      prompt: generatedStatement,
    };

    const response = await questionService.generateQuestion(body);

    if (response.status >= 200 && response.status < 300) {
      const { data } = response.data;

      setStatement(data.statement);
      setTags(data.tags);

      if (data.type === 'multipleChoice') {
        setOptions(data.options);
        setCorrectOption(data.gradingRubric);
      } else {
        setGradingRubric(data.gradingRubric);
      }

      setGeneratedData(data);
    } else {
      toast.error('Erro ao gerar questão.');
    }

    setGeneratingLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1
          onClick={() => {
            console.log(generatedData);
          }}
        >
          Nova questão para seção.
        </h1>
        <p>
          Preencha todos os campos obrigatórios para criar uma nova questão.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div>
            <h3>Teste</h3>
            <p>{exameName}</p>
          </div>
          <div>
            <h3>Seção</h3>
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
                    | 'challenge'
                    | 'programming'
                    | 'multiple-choice'
                    | 'text'
                    | ''
                );
              }}
            >
              <option value="">Selecione um tipo</option>
              <option value="challenge">Desafio</option>
              <option value="programming">Programação</option>
              <option value="multiple-choice">Múltipla escolha</option>
              <option value="text">Texto</option>
            </select>
          </div>
          <div>
            <h3>Peso da questão</h3>
            <select
              name="questionWeight"
              id="questionWeight"
              onChange={(e) => {
                setQuestionWeight(e.target.value as 1 | 2 | 3 | '');
              }}
            >
              <option value="">Peso da questão</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        {!generatingLoading && !generatedData && (
          <div className={styles.aiStatementInput}>
            <div>
              <label htmlFor="aiStatement">
                Descreva o que deseja na sua questão:
              </label>
              <textarea
                name="aiStatement"
                id="aiStatement"
                placeholder='Por exemplo: "Gere uma questão cujo enunciado seja longo e descreva as principais funcionalides do framework Node.js. O candidato deverá redigir um texto discutindo as vantagens e desvantagens do Node.js em comparação ao framework Django. O nível de dificuldade da questão deve ser alto e exigir conhecimentos profundos. Preciso de pelo menos três critérios de correção."'
                onChange={(e) => {
                  setGeneratedStatement(e.target.value);
                }}
              />
            </div>
            <button type="button" onClick={questionGenerateHandler}>
              {generatingLoading ? (
                <ThreeDots color="var(--neutral-0)" height={20} width={20} />
              ) : (
                'Gerar questão'
              )}
            </button>
          </div>
        )}

        {generatingLoading && (
          <div style={{ height: '300px' }} className="loadingContainer">
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
        )}

        {!generatingLoading && generatedData && (
          <>
            <div className={styles.contentBody}>
              <div className={styles.contentBox} style={{ height: '200px' }}>
                <h3>Enunciado</h3>
                <ReactQuill
                  theme="snow"
                  className={styles.customQuillStyle}
                  defaultValue={statement}
                  value={statement}
                  onChange={setStatement}
                  style={{ height: '120px' }}
                  placeholder="Digite o enunciado da questão aqui..."
                />
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
                      boxShadow: 'none',
                    }),
                    option: (provided) => ({
                      ...provided,
                      cursor: 'pointer',
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: 'var(--neutral-50)',
                      primary: 'var(--primary-2)',
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
                  value={tags.map((tag) => {
                    return {
                      value: tag,
                      label: tag,
                    };
                  })}
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
                      setIsShareable(e.target.value === 'true' ? true : false);
                    }}
                  >
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                </div>
              </div>
              <div style={{ display: questionType === '' ? 'none' : 'flex' }}>
                {questionType === 'multiple-choice' && (
                  <div className={styles.multipleChoiceContainer}>
                    <div className={styles.multipleChoiceHeader}>
                      <h3
                        onClick={() => {
                          console.log(options);
                        }}
                      >
                        Alternativas
                      </h3>
                      <p>Marque a alternativa correta</p>
                    </div>
                    {options.map((option, index) => {
                      return (
                        <div className={styles.option} key={index}>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              name="check"
                              id="check"
                              value={option.identifier}
                              checked={
                                correctOption.answer.option ===
                                option.identifier
                              }
                              onChange={(e) => {
                                setCorrectOption({
                                  answer: {
                                    option: e.target.checked
                                      ? option.identifier
                                      : '',
                                  },
                                });
                              }}
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <input
                            type="text"
                            value={option.description}
                            onChange={(e) => {
                              setOptions((oldOptions) => {
                                const newOptions = [...oldOptions];
                                newOptions[index].description = e.target.value;
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
                {questionType === 'programming' && (
                  <div className={styles.gradingRubricContainer}>
                    <h3>Critérios de correção</h3>
                    <div className={styles.gradingRubricInput}>
                      <div>
                        <label>Nome do critério</label>
                        <input
                          type="text"
                          placeholder='Por exemplo: "Clean Code", "Deploy", "Acurácia"'
                          ref={gradingRubricNameInputRef}
                        />
                      </div>
                      <button type="button" onClick={gradingRubricHandler}>
                        Adicionar
                      </button>
                    </div>
                    <div className={styles.gradingRubricTable}>
                      {gradingRubric.map((object, index) => {
                        const criteria = object.criteria;

                        return (
                          <form
                            className={styles.gradingRubricCard}
                            key={index}
                          >
                            <div className={styles.cardHeader}>
                              <h3>{criteria.title}</h3>
                              <AiFillCloseCircle
                                size={25}
                                onClick={() => deleteCriteria(index)}
                              />
                            </div>
                            <div>
                              <label>Peso do critério</label>
                              <input
                                type="number"
                                value={criteria.total_points}
                                onChange={(e) => {
                                  setGradingRubric((oldGradingRubric) => {
                                    const newGradingRubric = [
                                      ...oldGradingRubric,
                                    ];

                                    newGradingRubric[
                                      index
                                    ].criteria.total_points = +e.target.value;
                                    return newGradingRubric;
                                  });
                                }}
                              />
                            </div>

                            <div className={styles.criteriaContainer}>
                              <div className={styles.criteriaInput}>
                                <label>Nota máxima</label>
                                <textarea
                                  rows={5}
                                  value={criteria.maxValueCriteria.description}
                                  placeholder="Por exemplo 'Cumpriu com tudo que foi pedido e fez além...'"
                                  onChange={(e) => {
                                    setGradingRubric((oldGradingRubric) => {
                                      const newGradingRubric = [
                                        ...oldGradingRubric,
                                      ];

                                      newGradingRubric[
                                        index
                                      ].criteria.maxValueCriteria.description =
                                        e.target.value;
                                      return newGradingRubric;
                                    });
                                  }}
                                />
                              </div>
                              <div className={styles.criteriaValues}>
                                <div>
                                  <label style={{ color: 'var(--primary-2)' }}>
                                    Max
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.maxValueCriteria.value.max}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.maxValueCriteria.value.max =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label style={{ color: 'var(--warning)' }}>
                                    Min
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.maxValueCriteria.value.min}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.maxValueCriteria.value.min =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className={styles.criteriaContainer}>
                              <div className={styles.criteriaInput}>
                                <label>Nota média</label>
                                <textarea
                                  rows={5}
                                  value={criteria.avgValueCriteria.description}
                                  placeholder="Por exemplo 'Cumpriu parcialmente com o que foi pedido...'"
                                  onChange={(e) => {
                                    setGradingRubric((oldGradingRubric) => {
                                      const newGradingRubric = [
                                        ...oldGradingRubric,
                                      ];

                                      newGradingRubric[
                                        index
                                      ].criteria.avgValueCriteria.description =
                                        e.target.value;
                                      return newGradingRubric;
                                    });
                                  }}
                                />
                              </div>
                              <div className={styles.criteriaValues}>
                                <div>
                                  <label style={{ color: 'var(--primary-2)' }}>
                                    Max
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.avgValueCriteria.value.max}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.avgValueCriteria.value.max =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>

                                <div>
                                  <label style={{ color: 'var(--warning)' }}>
                                    Min
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.avgValueCriteria.value.min}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.avgValueCriteria.value.min =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className={styles.criteriaContainer}>
                              <div className={styles.criteriaInput}>
                                <label>Nota ruim</label>
                                <textarea
                                  rows={5}
                                  value={criteria.minValueCriteria.description}
                                  placeholder="Por exemplo 'Não cumpriu com o que foi pedido...'"
                                  onChange={(e) => {
                                    setGradingRubric((oldGradingRubric) => {
                                      const newGradingRubric = [
                                        ...oldGradingRubric,
                                      ];

                                      newGradingRubric[
                                        index
                                      ].criteria.minValueCriteria.description =
                                        e.target.value;
                                      return newGradingRubric;
                                    });
                                  }}
                                />
                              </div>
                              <div className={styles.criteriaValues}>
                                <div>
                                  <label style={{ color: 'var(--primary-2)' }}>
                                    Max
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.minValueCriteria.value.max}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.minValueCriteria.value.max =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label style={{ color: 'var(--warning)' }}>
                                    Min
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.minValueCriteria.value.min}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.minValueCriteria.value.min =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        );
                      })}
                    </div>
                    <div className={styles.techOptions}>
                      <h3>Runtimes:</h3>
                      <ul>
                        <li>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              name="option1"
                              id="option1"
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label htmlFor="option1">Javascript</label>
                        </li>
                        <li>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              name="option2"
                              id="option2"
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label htmlFor="option2">Python</label>
                        </li>
                        <li>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              name="option3"
                              id="option3"
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label htmlFor="option3">C++</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                {questionType === 'challenge' && (
                  <div className={styles.gradingRubricContainer}>
                    <h3>Critérios de correção</h3>
                    <div className={styles.gradingRubricInput}>
                      <div>
                        <label>Nome do critério</label>
                        <input
                          type="text"
                          placeholder='Por exemplo: "Clean Code", "Deploy", "Acurácia"'
                          ref={gradingRubricNameInputRef}
                        />
                      </div>
                      <button type="button" onClick={gradingRubricHandler}>
                        Adicionar
                      </button>
                    </div>
                    <div className={styles.gradingRubricTable}>
                      {gradingRubric.map((object, index) => {
                        const criteria = object.criteria;

                        return (
                          <form
                            className={styles.gradingRubricCard}
                            key={index}
                          >
                            <div className={styles.cardHeader}>
                              <h3>{criteria.title}</h3>
                              <AiFillCloseCircle
                                size={25}
                                onClick={() => deleteCriteria(index)}
                              />
                            </div>
                            <div>
                              <label>Peso do critério</label>
                              <input
                                type="number"
                                value={criteria.total_points}
                                onChange={(e) => {
                                  setGradingRubric((oldGradingRubric) => {
                                    const newGradingRubric = [
                                      ...oldGradingRubric,
                                    ];

                                    newGradingRubric[
                                      index
                                    ].criteria.total_points = +e.target.value;
                                    return newGradingRubric;
                                  });
                                }}
                              />
                            </div>

                            <div className={styles.criteriaContainer}>
                              <div className={styles.criteriaInput}>
                                <label>Nota máxima</label>
                                <textarea
                                  rows={5}
                                  value={criteria.maxValueCriteria.description}
                                  placeholder="Por exemplo 'Cumpriu com tudo que foi pedido e fez além...'"
                                  onChange={(e) => {
                                    setGradingRubric((oldGradingRubric) => {
                                      const newGradingRubric = [
                                        ...oldGradingRubric,
                                      ];

                                      newGradingRubric[
                                        index
                                      ].criteria.maxValueCriteria.description =
                                        e.target.value;
                                      return newGradingRubric;
                                    });
                                  }}
                                />
                              </div>
                              <div className={styles.criteriaValues}>
                                <div>
                                  <label style={{ color: 'var(--primary-2)' }}>
                                    Max
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.maxValueCriteria.value.max}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.maxValueCriteria.value.max =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label style={{ color: 'var(--warning)' }}>
                                    Min
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.maxValueCriteria.value.min}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.maxValueCriteria.value.min =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className={styles.criteriaContainer}>
                              <div className={styles.criteriaInput}>
                                <label>Nota média</label>
                                <textarea
                                  rows={5}
                                  value={criteria.avgValueCriteria.description}
                                  placeholder="Por exemplo 'Cumpriu parcialmente com o que foi pedido...'"
                                  onChange={(e) => {
                                    setGradingRubric((oldGradingRubric) => {
                                      const newGradingRubric = [
                                        ...oldGradingRubric,
                                      ];

                                      newGradingRubric[
                                        index
                                      ].criteria.avgValueCriteria.description =
                                        e.target.value;
                                      return newGradingRubric;
                                    });
                                  }}
                                />
                              </div>
                              <div className={styles.criteriaValues}>
                                <div>
                                  <label style={{ color: 'var(--primary-2)' }}>
                                    Max
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.avgValueCriteria.value.max}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.avgValueCriteria.value.max =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>

                                <div>
                                  <label style={{ color: 'var(--warning)' }}>
                                    Min
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.avgValueCriteria.value.min}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.avgValueCriteria.value.min =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className={styles.criteriaContainer}>
                              <div className={styles.criteriaInput}>
                                <label>Nota ruim</label>
                                <textarea
                                  rows={5}
                                  value={criteria.minValueCriteria.description}
                                  placeholder="Por exemplo 'Não cumpriu com o que foi pedido...'"
                                  onChange={(e) => {
                                    setGradingRubric((oldGradingRubric) => {
                                      const newGradingRubric = [
                                        ...oldGradingRubric,
                                      ];

                                      newGradingRubric[
                                        index
                                      ].criteria.minValueCriteria.description =
                                        e.target.value;
                                      return newGradingRubric;
                                    });
                                  }}
                                />
                              </div>
                              <div className={styles.criteriaValues}>
                                <div>
                                  <label style={{ color: 'var(--primary-2)' }}>
                                    Max
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.minValueCriteria.value.max}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.minValueCriteria.value.max =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label style={{ color: 'var(--warning)' }}>
                                    Min
                                  </label>
                                  <input
                                    type="number"
                                    value={criteria.minValueCriteria.value.min}
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.minValueCriteria.value.min =
                                          +e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        );
                      })}
                    </div>
                    <div className={styles.techOptions}>
                      <h3>Runtimes:</h3>
                      <ul>
                        <li>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              name="option1"
                              id="option1"
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label htmlFor="option1">Node</label>
                        </li>
                        <li>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              name="option2"
                              id="option2"
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label htmlFor="option2">Nginx</label>
                        </li>
                        <li>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              name="option3"
                              id="option3"
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label htmlFor="option3">Laravel</label>
                        </li>
                        <li>
                          <label className={styles.checkboxContainer}>
                            <input
                              type="checkbox"
                              name="option4"
                              id="option4"
                            />
                            <span className={styles.checkmark}></span>
                          </label>
                          <label htmlFor="option4">Python</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                {questionType === 'text' && (
                  <>
                    <div className={styles.gradingRubricContainer}>
                      <h3>Critérios de correção</h3>
                      <div className={styles.gradingRubricInput}>
                        <div>
                          <label>Nome do critério</label>
                          <input
                            type="text"
                            placeholder='Por exemplo: "Coerência e coesão", "Gramática", "Conteúdo"'
                            ref={gradingRubricNameInputRef}
                          />
                        </div>
                        <button type="button" onClick={gradingRubricHandler}>
                          Adicionar
                        </button>
                      </div>
                      <div className={styles.gradingRubricTable}>
                        {gradingRubric.map((object, index) => {
                          const criteria = object.criteria;

                          return (
                            <form
                              className={styles.gradingRubricCard}
                              key={index}
                            >
                              <div className={styles.cardHeader}>
                                <h3>{criteria.title}</h3>
                                <AiFillCloseCircle
                                  size={25}
                                  onClick={() => deleteCriteria(index)}
                                />
                              </div>
                              <div>
                                <label>Peso do critério</label>
                                <input
                                  type="number"
                                  value={criteria.total_points}
                                  onChange={(e) => {
                                    setGradingRubric((oldGradingRubric) => {
                                      const newGradingRubric = [
                                        ...oldGradingRubric,
                                      ];

                                      newGradingRubric[
                                        index
                                      ].criteria.total_points = +e.target.value;
                                      return newGradingRubric;
                                    });
                                  }}
                                />
                              </div>

                              <div className={styles.criteriaContainer}>
                                <div className={styles.criteriaInput}>
                                  <label>Nota máxima</label>
                                  <textarea
                                    rows={5}
                                    value={
                                      criteria.maxValueCriteria.description
                                    }
                                    placeholder="Por exemplo 'Cumpriu com tudo que foi pedido e fez além...'"
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.maxValueCriteria.description =
                                          e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                                <div className={styles.criteriaValues}>
                                  <div>
                                    <label
                                      style={{ color: 'var(--primary-2)' }}
                                    >
                                      Max
                                    </label>
                                    <input
                                      type="number"
                                      value={
                                        criteria.maxValueCriteria.value.max
                                      }
                                      onChange={(e) => {
                                        setGradingRubric((oldGradingRubric) => {
                                          const newGradingRubric = [
                                            ...oldGradingRubric,
                                          ];

                                          newGradingRubric[
                                            index
                                          ].criteria.maxValueCriteria.value.max =
                                            +e.target.value;
                                          return newGradingRubric;
                                        });
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ color: 'var(--warning)' }}>
                                      Min
                                    </label>
                                    <input
                                      type="number"
                                      value={
                                        criteria.maxValueCriteria.value.min
                                      }
                                      onChange={(e) => {
                                        setGradingRubric((oldGradingRubric) => {
                                          const newGradingRubric = [
                                            ...oldGradingRubric,
                                          ];

                                          newGradingRubric[
                                            index
                                          ].criteria.maxValueCriteria.value.min =
                                            +e.target.value;
                                          return newGradingRubric;
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className={styles.criteriaContainer}>
                                <div className={styles.criteriaInput}>
                                  <label>Nota média</label>
                                  <textarea
                                    rows={5}
                                    value={
                                      criteria.avgValueCriteria.description
                                    }
                                    placeholder="Por exemplo 'Cumpriu parcialmente com o que foi pedido...'"
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.avgValueCriteria.description =
                                          e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                                <div className={styles.criteriaValues}>
                                  <div>
                                    <label
                                      style={{ color: 'var(--primary-2)' }}
                                    >
                                      Max
                                    </label>
                                    <input
                                      type="number"
                                      value={
                                        criteria.avgValueCriteria.value.max
                                      }
                                      onChange={(e) => {
                                        setGradingRubric((oldGradingRubric) => {
                                          const newGradingRubric = [
                                            ...oldGradingRubric,
                                          ];

                                          newGradingRubric[
                                            index
                                          ].criteria.avgValueCriteria.value.max =
                                            +e.target.value;
                                          return newGradingRubric;
                                        });
                                      }}
                                    />
                                  </div>

                                  <div>
                                    <label style={{ color: 'var(--warning)' }}>
                                      Min
                                    </label>
                                    <input
                                      type="number"
                                      value={
                                        criteria.avgValueCriteria.value.min
                                      }
                                      onChange={(e) => {
                                        setGradingRubric((oldGradingRubric) => {
                                          const newGradingRubric = [
                                            ...oldGradingRubric,
                                          ];

                                          newGradingRubric[
                                            index
                                          ].criteria.avgValueCriteria.value.min =
                                            +e.target.value;
                                          return newGradingRubric;
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className={styles.criteriaContainer}>
                                <div className={styles.criteriaInput}>
                                  <label>Nota ruim</label>
                                  <textarea
                                    rows={5}
                                    value={
                                      criteria.minValueCriteria.description
                                    }
                                    placeholder="Por exemplo 'Não cumpriu com o que foi pedido...'"
                                    onChange={(e) => {
                                      setGradingRubric((oldGradingRubric) => {
                                        const newGradingRubric = [
                                          ...oldGradingRubric,
                                        ];

                                        newGradingRubric[
                                          index
                                        ].criteria.minValueCriteria.description =
                                          e.target.value;
                                        return newGradingRubric;
                                      });
                                    }}
                                  />
                                </div>
                                <div className={styles.criteriaValues}>
                                  <div>
                                    <label
                                      style={{ color: 'var(--primary-2)' }}
                                    >
                                      Max
                                    </label>
                                    <input
                                      type="number"
                                      value={
                                        criteria.minValueCriteria.value.max
                                      }
                                      onChange={(e) => {
                                        setGradingRubric((oldGradingRubric) => {
                                          const newGradingRubric = [
                                            ...oldGradingRubric,
                                          ];

                                          newGradingRubric[
                                            index
                                          ].criteria.minValueCriteria.value.max =
                                            +e.target.value;
                                          return newGradingRubric;
                                        });
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label style={{ color: 'var(--warning)' }}>
                                      Min
                                    </label>
                                    <input
                                      type="number"
                                      value={
                                        criteria.minValueCriteria.value.min
                                      }
                                      onChange={(e) => {
                                        setGradingRubric((oldGradingRubric) => {
                                          const newGradingRubric = [
                                            ...oldGradingRubric,
                                          ];

                                          newGradingRubric[
                                            index
                                          ].criteria.minValueCriteria.value.min =
                                            +e.target.value;
                                          return newGradingRubric;
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>
                          );
                        })}
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
                  onClick={createQuestionHandler}
                  className={styles.submit}
                >
                  Criar questão
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AiCreator;
