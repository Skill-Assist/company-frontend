import { FC } from "react";
import { BsArrowDown } from "react-icons/bs";

import ExamCard from "@/components/examCard";

import { Exam } from "@/types/exam";
import { User } from "@/types/user";

import styles from "./styles.module.scss";

interface Props {
  title: string;
  loading: boolean;
  owner: User;
  cards: Exam[];
  open: boolean;
  index: number;
  placeholder: string;
  toggleRow: (index: number) => void;
}

const cardsRow: FC<Props> = ({
  title,
  loading,
  owner,
  cards,
  open,
  index,
  placeholder,
  toggleRow,
}: Props) => {
  return (
    <div className={styles.cardsContainer}>
      <div className={styles.cardsRow} onClick={() => toggleRow(index)}>
        <div className={styles.divisor}>
          <p>{title}</p>
          <hr />
          <BsArrowDown size={25} className={open ? styles.rotate : ""} />
        </div>
        <div className={`${styles.cards} ${open ? styles.open : ""}`}>
          {!loading &&
            cards.length > 0 ?
            cards.map((exam: Exam) => <ExamCard key={exam.id} owner={owner} exam={exam} />)
            : <p>{placeholder}</p>
          }
        </div>
      </div>
    </div>
  );
};

export default cardsRow;
