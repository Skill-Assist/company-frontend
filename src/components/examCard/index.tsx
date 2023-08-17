import { FC } from 'react';

import Image from 'next/image';

import styles from './styles.module.scss';
import { Exam } from '@/types/exam';
import { User } from '@/types/user';
import Link from 'next/link';

type Props = {
  exam: Exam;
  owner: User;
};

const ExamCard: FC<Props> = ({ exam, owner }: Props) => {
  return (
    <Link href={`/exams/${exam.id}`} className={styles.card}>
      <div className={styles.header} style={{ backgroundColor: owner.color }}>
        <Image src={owner.logo} width={400} height={400} alt="owner name" />
      </div>
      <div className={styles.content}>
        <h2>{exam.title}</h2>
        <p>
          {exam.subtitle && exam.subtitle}{' '}
          {exam.subtitle && exam.level && '-'}{' '}
          {exam.level && exam.level}
        </p>

        <span>{owner.name}</span>
      </div>
    </Link>
  );
};

export default ExamCard;
