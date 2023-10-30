import { FC } from 'react';

import { Section } from '@/types/section';

import styles from './styles.module.scss';
import Link from 'next/link';

interface Props {
  section: Section;
  index: number;
  examId: number;
}

const SectionCard: FC<Props> = ({ section, index, examId }: Props) => {
  return (
    <div className={styles.section}>
      <div className={styles.cardHeader}>
        <h3>Seção {index + 1}</h3>
      </div>
      <div className={styles.formsContent}>
        <div className={styles.firstRow}>
          <div className={styles.field}>
            <p>
              <span>Nome da seção:</span>
              "{section.name[0].toUpperCase() + section.name.slice(1)}"
            </p>
          </div>
          <div className={styles.field}>
            <p>
              <span>Peso da seção:</span>
              {+section.weight * 100}%
            </p>
          </div>
          <div className={styles.field}>
            <p>
              <span>Duração da seção:</span>{' '}
              {section.durationInHours > 1
                ? section.durationInHours + ' horas'
                : section.durationInHours + ' hora'}
            </p>
          </div>
        </div>
        <div className={styles.field}>
          <p>
            <span>Descrição:</span> {section.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
