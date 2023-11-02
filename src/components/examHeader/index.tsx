import { FC } from 'react';

import Button from '../UI/button';

import { useReadableDuration } from '@/hooks/readableDuration';

import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { Exam } from '@/types/exam';

import styles from './styles.module.scss';

interface Props {
  examData: Exam;
  headerOpen: boolean;
  setHeaderOpen: (headerOpen: any) => void;
  setShowDeleteModal: (showDeleteModal: boolean) => void;
  checkIfArchivableHandler: () => void;
}

const ExamHeader: FC<Props> = ({
  examData,
  headerOpen,
  setHeaderOpen,
  setShowDeleteModal,
  checkIfArchivableHandler,
}: Props) => {
  const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: 'var(--verde-1)',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'var(--verde-1)',
      width: 200,
      fontSize: 10,
    },
  }));

  const readableDuration = useReadableDuration(examData?.durationInHours);

  return (
    <header>
      <h1>
        Teste{' '}
        <span>
          "
          {examData.jobTitle[0].toLocaleUpperCase() +
            examData.jobTitle.slice(1)}
          "
        </span>
      </h1>
      <div className={`${styles.examInfo} ${headerOpen ? styles.open : ''}`}>
        <div className={styles.firstRow}>
          <ul>
            <li>
              Nível da vaga:{' '}
              <span>
                {examData.jobLevel[0].toLocaleUpperCase() +
                  examData.jobLevel.slice(1)}
              </span>
            </li>
            <li>
              Duração do teste: <span>{readableDuration}</span>
            </li>
            <li>
              Prazo de envio:{' '}
              <span>
                {examData.submissionInHours / 24} dia
                {examData.submissionInHours / 24 > 1 && 's'}
              </span>
            </li>
          </ul>
          <div className={styles.statusContainer}>
            <div>
              <p>
                Status do teste:{' '}
                <span>
                  {examData.status === 'draft'
                    ? 'Rascunho'
                    : examData.status === 'published'
                    ? 'Publicado'
                    : 'Arquivado'}
                </span>
              </p>
              <StyledTooltip
                title={
                  'Os diferentes status definem como é possível interagir com o teste.'
                }
              >
                <InfoOutlinedIcon style={{ color: '#8C8895' }} />
              </StyledTooltip>
            </div>
            <Button
              actionType="action1"
              type="button"
              dimensions={{ width: '260px', height: '60px' }}
              onClick={checkIfArchivableHandler}
            >
              {examData.status === 'draft'
                ? 'Publicar'
                : examData.status === 'published'
                ? 'Arquivar'
                : 'Republicar'}
            </Button>
          </div>
        </div>
        <div className={styles.secondRow}>
          <ul>
            <li>
              {examData.showScore ? (
                <CheckRoundedIcon style={{ color: 'var(--azul-1)' }} />
              ) : (
                <CloseRoundedIcon
                  style={{ color: 'var(--vermelho-1)', opacity: 0.7 }}
                />
              )}{' '}
              O candidato receberá feedback do teste.
            </li>
            <li>
              {examData.isPublic ? (
                <CheckRoundedIcon style={{ color: 'var(--azul-1)' }} />
              ) : (
                <CloseRoundedIcon
                  style={{ color: 'var(--vermelho-1)', opacity: 0.7 }}
                />
              )}{' '}
              O teste não será adicionado ao banco de testes.
            </li>
          </ul>
          <div>
            <p>Descrição do teste:</p>
            <span>
              {examData.description ? (
                `"${examData.description}"`
              ) : (
                <i>Pendente</i>
              )}
            </span>
          </div>
        </div>
        <div className={styles.buttonsRow}>
          <Button
            type="button"
            actionType="delete"
            onClick={() => setShowDeleteModal(true)}
            dimensions={{ width: '125px', height: ' 41px' }}
          >
            Excluir teste
          </Button>
          <Button
            type="link"
            actionType="edit"
            url={`/exams/edit/${examData.id}`}
            dimensions={{ width: '106px', height: ' 41px' }}
          >
            Editar
          </Button>
        </div>
        <div className={styles.arrowIconBx}>
          {headerOpen ? (
            <KeyboardArrowDownRoundedIcon
              onClick={() => setHeaderOpen((headerOpen: any) => !headerOpen)}
            />
          ) : (
            <KeyboardArrowUpRoundedIcon
              onClick={() => setHeaderOpen((headerOpen: any) => !headerOpen)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default ExamHeader;
