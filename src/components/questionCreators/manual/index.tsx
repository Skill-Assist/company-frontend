import { useEffect, useState, useRef, FC, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import CreatableSelect from 'react-select/creatable';
const ReactQuill = dynamic(import('react-quill'), { ssr: false });
import { AiFillCloseCircle } from 'react-icons/ai';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

import examService from '@/services/examService';
import sectionService from '@/services/sectionService';
import questionService from '@/services/questionService';

import { Option } from '@/types/option';
import { Question } from '@/types/question';
import { GradingRubric } from '@/types/gradingRubric';

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

interface GradingRubricName {
  name: string;
  id: number;
}

interface Props {
  close: () => void;
  fetchQuestions: () => Promise<void>;
}

const ManualCreator: FC<Props> = ({ close, fetchQuestions }: Props) => {
  const [exameName, setExameName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [questionType, setQuestionType] = useState<
    'challenge' | 'programming' | 'multipleChoice' | 'text' | ''
  >('');
  const [questionWeight, setQuestionWeight] = useState<1 | 2 | 3 | ''>('');
  const [statement, setStatement] = useState('');

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

  const handleCreateQuestion = async () => {
    const sectionId = router.query.sectionId;

    if (!sectionId || typeof sectionId !== 'string') {
      return;
    }

    if (questionWeight === '') {
      toast.error('Preencha o peso da questão.');
      return;
    }

    if (questionType === '') {
      toast.error('Selecione um tipo de questão.');
      return;
    }

    if (statement === '') {
      toast.error('Preencha o enunciado da questão.');
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

    if (questionType === 'multipleChoice') {
      if (correctOption.answer.option === '') {
        toast.error('Selecione uma alternativa correta.');
        return;
      } else {
        questionData = {
          ...questionData,
          options: options,
          gradingRubric: correctOption,
        };
      }
    } else if (
      questionType === 'text' ||
      questionType === 'challenge' ||
      questionType === 'programming'
    ) {
      if (gradingRubric.length === 0) {
        toast.error('Adicione pelo menos um critério de correção.');
        return;
      } else {
        questionData = {
          ...questionData,
          gradingRubric: gradingRubric,
        };
      }
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

  return (
    <div className={styles.container} id="modal">
      <div className={styles.header}>
        <h1
          onClick={() => {
            console.log('options', options);
            console.log('correctOption', correctOption);
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
            <h3>Exame</h3>
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
                    | 'multipleChoice'
                    | 'text'
                    | ''
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
        <div className={styles.contentBody}>
          <div className={styles.contentBox} style={{ height: '200px' }}>
            <h3>Enunciado</h3>
            <ReactQuill
              theme="snow"
              value={statement}
              onChange={setStatement}
              style={{ height: '120px', background: 'white' }}
              className={styles.customQuillStyle}
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
            {questionType === 'multipleChoice' && (
              <div className={styles.multipleChoiceContainer}>
                <div className={styles.multipleChoiceHeader}>
                  <h3>Alternativas</h3>
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
                          checked={
                            correctOption.answer.option === option.identifier
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
                      <form className={styles.gradingRubricCard} key={index}>
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
                            onChange={(e) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[index].criteria.total_points =
                                  +e.target.value;
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
                      <form className={styles.gradingRubricCard} key={index}>
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
                            onChange={(e) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[index].criteria.total_points =
                                  +e.target.value;
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
                        <form className={styles.gradingRubricCard} key={index}>
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
