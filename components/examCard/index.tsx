import React from "react";

import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";

type Company = {
  name: string;
  color: string;
  logo: string;
};

type Exam = {
  id: number;
  entityName: string;
  owner: string;
  category: string;
  subCategory?: string | null;
  level?: string | null;
  durationInHours?: string | null;
  deadline?: string | null;
  isPublished: boolean;
  isLive: boolean;
  isArchived: boolean;
  status: string;
};

type Props = {
  company: Company;
  exam: Exam;
};

let examLeftTime: string = "";

const ExamCard: React.FC<Props> = ({ company, exam }: Props) => {
  if (exam.deadline) {
    const deadlineDate = new Date(exam.deadline);
    const currentDate = new Date();

    const diff = deadlineDate.getTime() - currentDate.getTime();

    const diffInHours = Math.floor(diff / (1000 * 3600));

    if (diffInHours > 24) {
      const diffInDays = Math.floor(diff / (1000 * 3600 * 24));
      examLeftTime = `${diffInDays}`
    } else {
      examLeftTime = `${diffInHours}`;
    }
  } else if (exam.durationInHours && !exam.deadline) {
    //TODO: get exam start time and calculate the left time

    examLeftTime = `${exam.durationInHours} horas`;
  }

  return (
    <Link href={`/exams/intro/${exam.id}`} className={styles.card}>
      <div className={styles.header} style={{ backgroundColor: company.color }}>
        <Image
          className={styles.logo}
          src={company.logo}
          width={0}
          height={0}
          alt="company name"
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {exam.category} {exam.subCategory && exam.subCategory}{" "}
          {exam.level && exam.level}
        </h2>

        <span className={styles.company}>{exam.owner}</span>

        <div className={styles.info}>
          <p className="status">Não iniciado</p>
          <p className={styles.deadline}>Restam {examLeftTime} dias</p>
        </div>
      </div>
    </Link>
  );
};

export default ExamCard;
