import { FC } from 'react';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import styles from './styles.module.scss';
import Button from '../UI/button';

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
              <CheckRoundedIcon style={{ color: 'var(--azul-1)' }} />
            ) : (
              <CloseRoundedIcon style={{ color: 'rgba(255, 69, 69, 0.7)' }} />
            )}{' '}
            O candidato receberá feedback do teste.
          </li>
          <li>
            {examIsPublic ? (
              <CheckRoundedIcon style={{ color: 'var(--azul-1)' }} />
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

      <Button
        type="submit"
        form={editing ? 'updateExam' : 'createExam'}
        actionType="confirm"
      >
        {editing ? 'Salvar alterações' : 'Criar teste'}
      </Button>
    </div>
  );
};

export default ExamPreview;
