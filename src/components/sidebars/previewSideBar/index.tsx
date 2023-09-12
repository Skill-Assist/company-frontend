import { FC, useState, useEffect, useRef } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { BiPencil } from 'react-icons/bi';
import { TbInfoSquareRounded } from 'react-icons/tb';
import { toast } from 'react-hot-toast';

import examService from '@/services/examService';

import { Exam } from '@/types/exam';

import styles from './styles.module.scss';

interface Props {
  examTitle?: string;
  examSubtitle?: string;
  examLevel?: string;
  examDuration?: string;
  examSubmissionDay?: number;
  examShowScore?: boolean;
  examIsPublic?: boolean;
}

const PreviewSideBar: FC<Props> = ({
  examTitle,
  examSubtitle,
  examLevel,
  examDuration,
  examSubmissionDay,
  examShowScore,
  examIsPublic,
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.examHeader}>
        <div className={styles.headerTitle}>
          <h2>{examTitle ? examTitle : 'Título'}</h2>
        </div>
        <div className={styles.headerSub}>
          <p>
            {examSubtitle && examSubtitle} {examSubtitle && examLevel && '-'}{' '}
            {examLevel && examLevel}
            {!examSubtitle && !examLevel && 'Subtitulo - Level'}
          </p>
        </div>
      </div>

      <h3>
        <TbInfoSquareRounded />
        Informações do teste
      </h3>
      <div className={styles.infosBox}>
        <div>
          <span>Duração:</span>
          <p>
            {examDuration
              ? `${examDuration.split(':')[0]} hr${
                  +examDuration.split(':')[0] === 1 ? '' : 's'
                } e ${examDuration.split(':')[1]} minuto${
                  +examDuration.split(':')[1] === 1 ? '' : 's'
                }`
              : '--:--'}{' '}
          </p>
        </div>
        <div>
          <span>Prazo:</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            <p>{examSubmissionDay && examSubmissionDay + ' dias'} </p>
          </div>
        </div>
        <div>
          <span>O candidato deve receber sua nota?</span>
          <p>{examShowScore === true ? 'Sim' : 'Não'}</p>
        </div>
        <div>
          <span>O teste é público?</span>
          <p>{examIsPublic === true ? 'Sim' : 'Não'}</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewSideBar;
