import { FC, useRef, useState } from 'react';
import Image from 'next/image';

import Button from '../UI/button';
import SelectField from '../UI/selectField';
import InputField from '../UI/inputField';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import RoundedPlus from '@public/icons/fa/roundedPlus.svg';
import RoundedDoubt from '@public/icons/fa/roundedDoubt.svg';
import RoundedError from '@public/icons/fa/roundedError.svg';
import RoundedSuccess from '@public/icons/fa/roundedSuccess.svg';
import { GradingRubric } from '@/types/gradingRubric';

import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Question } from '@/types/question';
import { Option } from '@/types/option';

interface Props {
  index: number;
}

const QuestionForm: FC<Props> = ({ index }: Props) => {
  const [cardOpen, setCardOpen] = useState(true);

  const [questionType, setQuestionType] = useState<
    'multipleChoice' | 'text' | 'programming' | 'challenge' | ''
  >('');
  const [questionWeight, setQuestionWeight] = useState(1);
  const [questionStatement, setQuestionStatement] = useState('');

  const router = useRouter();

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
  const [gradingRubric, setGradingRubric] = useState<GradingRubric>([]);

  const gradingRubricHandler = () => {
    const newCriteria = {
      open: true,
      criteria: {
        title: '',
        total_points: 0,
        maxValueCriteria: {
          description: '',
          value: {
            min: 0,
            max: 100,
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
  };

  const deleteCriteria = (index: number) => {
    setGradingRubric((oldGradingRubric) => {
      const newGradingRubric = [...oldGradingRubric];
      newGradingRubric.splice(index, 1);
      return newGradingRubric;
    });
  };

  // End of Grading Rubric Variables and Logic

  const createQuestionHandler = async () => {
    const sectionId = router.query.sectionId;

    if (!sectionId || typeof sectionId !== 'string') {
      return;
    }

    if (questionType === '') {
      toast.error('Selecione um tipo de questão.');
      return;
    }

    if (questionStatement === '') {
      toast.error('Preencha o enunciado da questão.');
      return;
    }

    let questionData: Question = {
      type: questionType,
      statement: questionStatement,
      // tags,
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

    console.log('questionData', questionData);

    // const response = await questionService.createQuestion(
    //   questionData,
    //   sectionId,
    //   +questionWeight
    // );

    // if (response.status >= 200 && response.status < 300) {
    //   toast.success('Questão criada com sucesso.');
    //   fetchQuestions();
    //   close();
    // } else {
    //   toast.error('Erro ao criar questão.');
    // }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1>Questão {index + 1}</h1>
        {cardOpen ? (
          <KeyboardArrowDownRoundedIcon
            onClick={() => setCardOpen(!cardOpen)}
          />
        ) : (
          <KeyboardArrowUpRoundedIcon onClick={() => setCardOpen(!cardOpen)} />
        )}
      </div>
      <div className={styles.openedContent}>
        <SelectField
          label="Tipo de questão"
          required
          options={['Múltipla escolha', 'Discursiva', 'Programação']}
          value={questionType}
          onChange={(value) => {
            if (value === 'Múltipla escolha') {
              setQuestionType('multipleChoice');
            } else if (value === 'Discursiva') {
              setQuestionType('text');
            } else if (value === 'Programação') {
              setQuestionType('programming');
            }
          }}
          labelBgColor="var(--creating_bg)"
        />
        <h2>Enunciado</h2>
        <InputField
          label=""
          value={questionStatement}
          setState={setQuestionStatement}
          max={1000}
          counter
          rows={5}
          type="text"
        />
      </div>
      {questionType !== '' && (
        <div
          className={`${styles.gradingRubricContainer} ${
            cardOpen ? styles.open : ''
          }`}
        >
          <div className={styles.gradingRubricHeader}>
            <h1 onClick={() => console.log(cardOpen)}>
              {questionType === 'multipleChoice'
                ? 'Alternativas'
                : 'Critérios de correção'}
              <Image height={25} width={25} src={RoundedPlus} alt="plus_icon" />
            </h1>
            <button type="button" onClick={gradingRubricHandler}>
              Adicionar
            </button>
          </div>
          {questionType !== 'multipleChoice' && (
            <>
              {gradingRubric.map((object, index) => {
                const criteria = object.criteria;

                return (
                  <div className={styles.gradingRubricCard} key={index}>
                    <div className={styles.gradingRubricCardHeader}>
                      <h3
                        onClick={() => {
                          console.log(gradingRubric);
                        }}
                      >
                        Critério {index < 9 && '0' + (+index + 1)}
                      </h3>
                      {object.open ? (
                        <KeyboardArrowDownRoundedIcon
                          onClick={() =>
                            setGradingRubric((oldGradingRubric) => {
                              const newGradingRubric = [...oldGradingRubric];
                              newGradingRubric[index].open = false;
                              return newGradingRubric;
                            })
                          }
                        />
                      ) : (
                        <KeyboardArrowUpRoundedIcon
                          onClick={() =>
                            setGradingRubric((oldGradingRubric) => {
                              const newGradingRubric = [...oldGradingRubric];
                              newGradingRubric[index].open = true;
                              return newGradingRubric;
                            })
                          }
                        />
                      )}
                    </div>
                    <form
                      className={`${styles.gradingRubricForm} ${
                        object.open ? styles.open : {}
                      }`}
                      key={index}
                    >
                      <div className={styles.gradingRubricTitleWeightContainer}>
                        <InputField
                          label="Nome do critério"
                          required
                          value={criteria.title}
                          type="text"
                          key={'title-' + index}
                          setState={(value) => {
                            setGradingRubric((oldGradingRubric) => {
                              const newGradingRubric = [...oldGradingRubric];

                              newGradingRubric[index].criteria.title = value;
                              return newGradingRubric;
                            });
                          }}
                          labelBgColor="var(--primary-background)"
                        />
                        <InputField
                          label="Peso do critério"
                          required
                          value={criteria.total_points}
                          type="number"
                          key={'total_points-' + index}
                          setState={(value) => {
                            setGradingRubric((oldGradingRubric) => {
                              const newGradingRubric = [...oldGradingRubric];

                              newGradingRubric[index].criteria.total_points =
                                +value;
                              return newGradingRubric;
                            });
                          }}
                          labelBgColor="var(--primary-background)"
                        />
                      </div>

                      <h4>Níveis de pontuação:</h4>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaCategory}>
                          <Image
                            src={RoundedSuccess}
                            alt="success_icon"
                            height={24}
                            width={24}
                          />
                          <p>Chegou lá:</p>
                        </div>

                        <div className={styles.criteriaValues}>
                          <p>Notas com pontuação a partir de </p>
                          <input
                            type="number"
                            onChange={(e) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[
                                  index
                                ].criteria.maxValueCriteria.value.min =
                                  +e.target.value;
                                return newGradingRubric;
                              });
                            }}
                          />
                          <p>
                            pontos até <span>100</span> pontos.
                          </p>
                        </div>

                        <div className={styles.criteriaInput}>
                          <p>Como alcançar essa nota?</p>
                          <InputField
                            label=""
                            type="text"
                            rows={2}
                            value={criteria.maxValueCriteria.description}
                            setState={(value) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[
                                  index
                                ].criteria.maxValueCriteria.description = value;
                                return newGradingRubric;
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaCategory}>
                          <Image
                            src={RoundedDoubt}
                            alt="doubt_icon"
                            height={24}
                            width={24}
                          />
                          <p>Estava no caminho:</p>
                        </div>

                        <div className={styles.criteriaValues}>
                          <p>Notas com pontuação a partir de </p>
                          <input
                            type="number"
                            onChange={(e) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[
                                  index
                                ].criteria.avgValueCriteria.value.min =
                                  +e.target.value;
                                return newGradingRubric;
                              });
                            }}
                          />
                          <p>pontos até</p>
                          <input
                            type="number"
                            onChange={(e) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[
                                  index
                                ].criteria.avgValueCriteria.value.max =
                                  +e.target.value;
                                return newGradingRubric;
                              });
                            }}
                          />
                          <p>pontos.</p>
                        </div>

                        <div className={styles.criteriaInput}>
                          <p>Como alcançar essa nota?</p>
                          <InputField
                            label=""
                            type="text"
                            rows={2}
                            value={criteria.avgValueCriteria.description}
                            setState={(value) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[
                                  index
                                ].criteria.avgValueCriteria.description = value;
                                return newGradingRubric;
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className={styles.criteriaContainer}>
                        <div className={styles.criteriaCategory}>
                          <Image
                            src={RoundedError}
                            alt="error_icon"
                            height={24}
                            width={24}
                          />
                          <p>Não conseguiu:</p>
                        </div>

                        <div className={styles.criteriaValues}>
                          <p>Notas com pontuação a partir de </p>
                          <input
                            type="number"
                            onChange={(e) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[
                                  index
                                ].criteria.minValueCriteria.value.min =
                                  +e.target.value;
                                return newGradingRubric;
                              });
                            }}
                          />
                          <p>pontos até</p>
                          <input
                            type="number"
                            onChange={(e) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[
                                  index
                                ].criteria.minValueCriteria.value.max =
                                  +e.target.value;
                                return newGradingRubric;
                              });
                            }}
                          />
                          <p>pontos.</p>
                        </div>

                        <div className={styles.criteriaInput}>
                          <p>Como alcançar essa nota?</p>
                          <InputField
                            label=""
                            type="text"
                            rows={2}
                            value={criteria.minValueCriteria.description}
                            setState={(value) => {
                              setGradingRubric((oldGradingRubric) => {
                                const newGradingRubric = [...oldGradingRubric];

                                newGradingRubric[
                                  index
                                ].criteria.minValueCriteria.description = value;
                                return newGradingRubric;
                              });
                            }}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                );
              })}
            </>
          )}
          <div className={styles.actions}>
            <Button
              type="button"
              actionType="action4"
              dimensions={
                // isSuggestionQuestion
                true
                  ? { width: '17.2rem', height: '4.1rem' }
                  : { width: '9.8rem', height: '4.1rem' }
              }
              onClick={
                // isSuggestionQuestion
                true
                  ? () => console.log('deleteSuggestion(sectionIndex)')
                  : () => console.log('deleteSection')
              }
            >
              <CloseRoundedIcon
                style={{
                  fontSize: '2.4rem',
                  marginRight: '0.2rem',
                  color: 'var(--vermelho-1)',
                  opacity: 0.7,
                }}
              />
              {/* Excluir {isSuggestionQuestion && 'Sugestão'} */}
              Excluir {true && 'Sugestão'}
            </Button>
            <Button
              type="button"
              onClick={createQuestionHandler}
              actionType="action3"
              dimensions={
                // isSuggestionQuestion
                true
                  ? { width: '17.2rem', height: '4.1rem' }
                  : { width: '9.8rem', height: '4.1rem' }
              }
            >
              <CheckRoundedIcon
                style={{
                  fontSize: '2.4rem',
                  marginRight: '0.2rem',
                  color: 'var(--azul-1)',
                }}
              />
              {/* {isSuggestionQuestion ? 'Aceitar sugestão' : 'Criar'} */}
              {true ? 'Aceitar sugestão' : 'Criar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;
