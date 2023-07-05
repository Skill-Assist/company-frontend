import { FC } from "react";

import styles from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";
import { Exam } from "@/types/exam";
import { Invitation } from "@/types/invitation";
import Timer from "../timer";

type Props = {
  invitation: Invitation;
};

const ExamCard: FC<Props> = ({ invitation }: Props) => {
  const { examRef: exam } = invitation;
  const { createdByRef: company } = exam;

  let examLeftTime: Date = new Date();
  if (exam.answerSheetsRef) {
    const startExamDate = new Date(exam.answerSheetsRef.startDate);
    const currentDate = new Date();

    const timeSpent = Math.floor(
      (currentDate.getTime() - startExamDate.getTime()) / 1000
    );

    const diff = exam.durationInHours * 3600 - timeSpent;

    examLeftTime.setSeconds(examLeftTime.getSeconds() + diff);
  }

  let submitionLeftTime: Date = new Date();

  if (invitation) {
    const invitationDate = new Date(invitation.createdAt);
    const currentDate = new Date();

    const timeSpent = Math.floor(
      (currentDate.getTime() - invitationDate.getTime()) / 1000
    );

    const diff = invitation.examRef.durationInHours * 3600 - timeSpent;

    submitionLeftTime.setSeconds(submitionLeftTime.getSeconds() + diff);
  }

  return (
    <Link
      href={
        !exam.answerSheetsRef
          ? `/exams/intro/${exam.id}`
          : exam.answerSheetsRef && !exam.answerSheetsRef.endDate ? `/exams/${exam.answerSheetsRef.id}`
          : `/results`
      }
      className={styles.card}
    >
      <div className={styles.header} style={{ backgroundColor: company.color }}>
        <Image
          className={styles.logo}
          src={company.logo}
          width={400}
          height={400}
          alt="company name"
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {exam.title} {exam.subtitle && exam.subtitle}{" "}
          {exam.level && exam.level}
        </h2>

        <span className={styles.company}>{exam.createdByRef.name}</span>

        <div className={styles.info}>
          {!exam.answerSheetsRef ? (
            <>
              <p>Não iniciado</p>
              <p className={styles.deadline}>
                Restam <Timer expiryTimestamp={submitionLeftTime} />
              </p>
            </>
          ) : exam.answerSheetsRef && !exam.answerSheetsRef.endDate ? (
            <>
              <span className={styles.leftTime}>
                Você tem <Timer expiryTimestamp={examLeftTime} /> para finalizar
                seu teste
              </span>
            </>
          ) : (
            <>
              <p>Finalizado</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ExamCard;
