import { FC } from 'react';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import styles from './styles.module.scss';

interface Props {
  examTitle?: string;
  examLevel?: string;
  examDescription?: string;
  examDuration?: string;
  examSubmissionDay?: number;
  examShowScore?: boolean;
  examIsPublic?: boolean;
  editing?: boolean;
}

const ExamPreview: FC<Props> = ({
  examTitle,
  examLevel,
  examDescription,
  examDuration,
  examSubmissionDay,
  examShowScore,
  examIsPublic,
  editing,
}: Props) => {
  let readableDuration = '';

  if (examDuration) {
    const hours = examDuration.split(':')[0];
    const minutes = examDuration.split(':')[1];

    let hoursText = '';

    if (hours === '01') {
      hoursText = 'hora';
    } else {
      hoursText = 'horas';
    }

    let minutesText = '';

    if (minutes === '01') {
      minutesText = 'minuto';
    } else {
      minutesText = 'minutos';
    }

    readableDuration = `${hours} ${hoursText} ${
      minutes !== '00' ? `e ${minutes} ${minutesText}` : ''
    }`;
  }

  return (
    <div className={styles.container}>
      <h2>Resumo do teste</h2>
      <div className={styles.content}>
        <ul>
          <li>
            Nome da vaga:{' '}
            <span>{examTitle ? `"${examTitle}"` : <i>Pendente</i>}</span>
          </li>
          <li>
            Nível da vaga:{' '}
            <span>{examLevel ? examLevel : <i>Pendente</i>}</span>
          </li>
          <li>
            Duração do teste:{' '}
            <span>{examDuration ? readableDuration : <i>Pendente</i>}</span>
          </li>
          <li>
            Prazo de envio:{' '}
            <span>
              {examSubmissionDay ? (
                `${examSubmissionDay} dia${examSubmissionDay > 1 ? 's' : ''}`
              ) : (
                <i>Pendente</i>
              )}
            </span>
          </li>
          <li>
            {examShowScore ? (
              <CheckRoundedIcon style={{ color: '#829CE4' }} />
            ) : (
              <CloseRoundedIcon style={{ color: 'rgba(255, 69, 69, 0.7)' }} />
            )}{' '}
            O candidato receberá feedback do teste.
          </li>
          <li>
            {examIsPublic ? (
              <CheckRoundedIcon style={{ color: '#829CE4' }} />
            ) : (
              <CloseRoundedIcon style={{ color: 'rgba(255, 69, 69, 0.7)' }} />
            )}{' '}
            O teste não será adicionado ao banco de testes.
          </li>
        </ul>
        <div>
          <p>Descrição do teste:</p>
          <span>
            {examDescription ? `"${examDescription}"` : <i>Pendente</i>}
          </span>
        </div>
      </div>

      <button type="submit" form={editing ? 'updateExam' : 'createExam'}>
        {editing ? 'Salvar alterações' : 'Criar teste'}
      </button>
    </div>
  );
};

export default ExamPreview;
