import { FC, useState } from "react";
import { BsArrowDown, BsFillTrashFill } from "react-icons/bs";
import parse from "html-react-parser";

import ExamCard from "@/components/examCard";

import { Exam } from "@/types/exam";
import { User } from "@/types/user";

import styles from "./styles.module.scss";
import { Question } from "@/types/question";
import { toast } from "react-hot-toast";

interface Props {
  question: Question;
  index: number;
}

const QuestionCard: FC<Props> = ({ index, question }: Props) => {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.header} onClick={() => setOpen((open) => !open)}>
        <h3>Questão {index + 1}</h3>
        <div>
          <BsFillTrashFill
            className={styles.deleteIcon}
            size={20}
            fill="var(--warning)"
            onClick={() =>
              toast.loading("Feature em desenvolvimento", {
                duration: 3000,
                position: "top-right",
              })
            }
          />
          <BsArrowDown
            size={25}
            className={open ? styles.rotate : ""}
            fill="var(--secondary-2)"
          />
        </div>
      </div>
      <div className={`${styles.content} ${open ? styles.open : ""}`}>
        {parse(question.statement)}
        {question.type === "multipleChoice" && question.options && (
          <div className={styles.options}>
            <>
              <h3>Alternativas</h3>
              {Object.keys(question.options).map((option, index) => {
                return (
                  <div className={styles.option} key={index}>
                    <label className={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        name="check"
                        id="check"
                        disabled
                        checked={
                          question.gradingRubric.answer.option === option
                        }
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                    <p>
                      {question.options &&
                        Object.values(question.options)[index]}
                    </p>
                  </div>
                );
              })}
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
