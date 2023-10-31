import { FC, useState } from 'react';
import { BsArrowDown, BsFillTrashFill } from 'react-icons/bs';
import parse from 'html-react-parser';

import styles from './styles.module.scss';
import { Question } from '@/types/question';
import { toast } from 'react-hot-toast';
import { AiFillTag } from 'react-icons/ai';

interface Props {
  question: Question;
  index: number;
}

const QuestionCard: FC<Props> = ({ index, question }: Props) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.header} onClick={() => setOpen((open) => !open)}>
        <h3>Questão {index}</h3>
        <div>
          <BsFillTrashFill
            className={styles.deleteIcon}
            size={20}
            fill="var(--vermelho-1)"
            onClick={() =>
              toast.loading('Feature em desenvolvimento', {
                duration: 3000,
                position: 'top-center',
              })
            }
          />
          <BsArrowDown
            size={25}
            className={open ? styles.rotate : ''}
            fill="var(--cinza-4)"
          />
        </div>
      </div>
      <div className={`${styles.content} ${open ? styles.open : ''}`}>
        {parse(question.statement)}
        {question.type === 'multipleChoice' && question.options && (
          <div className={styles.options}>
            <>
              <h3>Alternativas</h3>
              {question.options.map((option, index) => {
                return (
                  <div className={styles.option} key={index}>
                    <label className={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        name="check"
                        id="check"
                        disabled
                        checked={
                          question.gradingRubric.answer.option ===
                          option.identifier
                        }
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                    <p>
                      {question.options && question.options[index].description}
                    </p>
                  </div>
                );
              })}
            </>
          </div>
        )}
        {question.tags && question.tags?.length > 0 && (
          <div className={styles.tags}>
            <h3>Tags</h3>
            <div className={styles.tagsContainer}>
              {question.tags.map((tag, index) => (
                <div key={index}>
                  <AiFillTag size={20} color="var(--cinza-4)" />
                  <p key={index}>{tag}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
