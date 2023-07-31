import {
  useState,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
  ChangeEvent,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Tooltip } from '@nextui-org/react';
import { ThreeDots } from 'react-loader-spinner';
import { AiOutlineReload, AiOutlineSend } from 'react-icons/ai';
import { GiNotebook } from 'react-icons/gi';

import examService from '@/services/examService';

import styles from './styles.module.scss';
import Image from 'next/image';
import { Candidate } from '@/types/candidate';

const InvitationContainer = () => {
  const [invitationLoading, setInvitationLoading] = useState(false);
  const [correctionLoading, setCorrectionLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [emails, setEmails] = useState<string[]>([]);
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const expirationInHoursInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const fetchCandidates = async () => {
    setTableLoading(true);
    const examId = router.query.examId;

    if (examId && typeof examId === 'string') {
      const response = await examService.getCandidates(examId);

      if (response.status >= 200 && response.status < 300) {
        setCandidates(response.data.reverse());
        setTableLoading(false);
      } else {
        toast.error('Erro ao buscar candidatos!');
        setTableLoading(false);
      }
    }
  };

  useEffect(() => {
    const examId = router.query.examId;

    if (examId || typeof examId === 'string') {
      const fetchInvitations = async () => {
        const examId = router.query.examId;

        if (examId && typeof examId === 'string') {
          const response = await examService.getInvitation(examId);
        }
      };

      fetchInvitations();
    }

    fetchCandidates();
  }, [router]);

  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>): void => {
    if (['Enter', 'Tab', ',', ' '].includes(evt.key)) {
      evt.preventDefault();

      const trimmedValue = value.trim();

      if (trimmedValue && isValid(trimmedValue)) {
        setEmails([...emails, trimmedValue]);
        setValue('');
      }
    }
  };

  const handleInputBlur = (): void => {
    const trimmedValue = value.trim();

    if (trimmedValue && isValid(trimmedValue)) {
      setEmails([...emails, trimmedValue]);
      setValue('');
    }
  };

  const handleChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    setValue(evt.target.value);
    setError(null);
  };

  const handleDelete = (email: string): void => {
    setEmails(emails.filter((i) => i !== email));
  };

  const handlePaste = (evt: ClipboardEvent<HTMLInputElement>): void => {
    evt.preventDefault();

    const paste = evt.clipboardData.getData('text');
    const emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

    if (emails) {
      const toBeAdded = emails.filter((email) => !isInList(email));
      setEmails([...emails, ...toBeAdded]);
    }
  };

  const isValid = (email: string): boolean => {
    let error: string | null = null;

    if (isInList(email)) {
      error = `"${email}" já foi adicionado.`;
    }

    if (!isEmail(email)) {
      error = `"${email}" não é um email válido.`;
    }

    if (error) {
      setError(error);
      return false;
    }

    return true;
  };

  const isInList = (email: string): boolean => {
    return emails.includes(email);
  };

  const isEmail = (email: string): boolean => {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  };

  const sendInvitationHandler = async () => {
    setInvitationLoading(true);

    const examId = router.query.examId;
    const enteredExpirationInHours = expirationInHoursInputRef.current?.value;

    if (!examId || typeof examId !== 'string') {
      setError('Erro ao buscar o exame!');
      setInvitationLoading(false);
      return;
    }

    if (!enteredExpirationInHours) {
      setError('Digite um valor para a expiração do convite!');
      setInvitationLoading(false);
      return;
    }

    const invitationData = {
      email: emails,
      expirationInHours: +enteredExpirationInHours,
    };

    const response = await examService.sendInvitation(examId, invitationData);

    if (response.status >= 200 && response.status < 300) {
      toast.success('Convite enviado com sucesso!');
      setInvitationLoading(false);
      setEmails([]);
      setValue('');
      setError(null);
      expirationInHoursInputRef.current!.value = '';
      fetchCandidates();
    } else if (
      response.data.message ===
      'Exam is not published or live. Process was aborted.'
    ) {
      toast.error('O exame não está publicado ou em andamento!');
      setInvitationLoading(false);
    } else {
      toast.error('Erro ao enviar convite!');
      setInvitationLoading(false);
    }
  };

  const generateStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <p
            style={{
              backgroundColor: 'var(--neutral-50)',
              color: 'var(--secondary)',
            }}
            className={styles.status}
          >
            Pendente
          </p>
        );
      case 'accepted':
        return (
          <p
            style={{
              backgroundColor: 'var(--success)',
              color: 'var(--neutral-0)',
            }}
            className={styles.status}
          >
            Aceito
          </p>
        );
      case 'rejected':
        return (
          <p
            style={{
              backgroundColor: 'var(--warning)',
              color: 'var(--neutral-0)',
            }}
            className={styles.status}
          >
            Recusado
          </p>
        );
      case 'expired':
        return (
          <p
            style={{
              backgroundColor: 'var(--alert)',
              color: 'var(--neutral-0)',
            }}
            className={styles.status}
          >
            Expirado
          </p>
        );
      case 'started':
        return (
          <p
            style={{
              backgroundColor: 'var(--secondary-2)',
              color: 'var(--neutral-0)',
            }}
            className={styles.status}
          >
            Iniciado
          </p>
        );
      case 'finished':
        return (
          <p
            style={{
              backgroundColor: '#59a15f',
              color: 'var(--neutral-0)',
            }}
            className={styles.status}
          >
            Finalizado
          </p>
        );
    }
  };

  const handleResendInvitation = async (invitationId: number) => {
    const response = await examService.resendInvitation(invitationId);

    if (response.status >= 200 && response.status < 300) {
      toast.success('Convite reenviado com sucesso!');
      fetchCandidates();
    } else {
      toast.error('Erro ao reenviar convite!');
      fetchCandidates();
    }
  };

  const handleGenerateCorrection = async (answerSheetId: number) => {
    setCorrectionLoading(true);
    const response = await examService.generateCorrection(answerSheetId);

    if (response.status >= 200 && response.status < 300) {
      toast.success('Correção gerada com sucesso!');
      setCorrectionLoading(false);
      fetchCandidates();
    } else if (response.data.message === "Service Unavailable") {
      toast.error('Serviço indisponível no momento. Tente novamente mais tarde.');
      setCorrectionLoading(false);
      fetchCandidates();
    } else {
      toast.error('Erro ao gerar correção!');
      setCorrectionLoading(false);
      fetchCandidates();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.field}>
          <label htmlFor="emails">E-mails</label>
          <div className={styles.emailContainer}>
            <div className={styles.emailsList}>
              {emails.map((email) => (
                <div key={email}>
                  {email}
                  <button type="button" onClick={() => handleDelete(email)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <input
              value={value}
              placeholder='Insira os e-mail e pressione "Enter"'
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              onPaste={handlePaste}
              onBlur={handleInputBlur}
              id="emails"
              ref={emailInputRef}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <div className={styles.headerSecondLine}>
          <div className={styles.field}>
            <label htmlFor="expirationInHours">Expiração do convite</label>
            <input
              id="expirationInHours"
              type="number"
              min="1"
              max="24"
              className={styles.expirationInHoursInput}
              placeholder="Digite o número de horas para expiração do convite"
              ref={expirationInHoursInputRef}
            />
          </div>

          <button
            onClick={sendInvitationHandler}
            disabled={emails.length === 0 ? true : false}
            type="button"
          >
            {invitationLoading ? (
              <ThreeDots
                height="15"
                width="15"
                radius="9"
                color="white"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                visible={true}
              />
            ) : (
              `Enviar convite${emails.length > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h2>Lista de candidatos</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <span>Nome</span>
              </th>
              <th>
                <span style={{ justifySelf: 'center', marginRight: '18px' }}>
                  Status
                </span>
              </th>
              <th>
                <span style={{ justifySelf: 'center', marginRight: '18px' }}>
                  Ações
                </span>
              </th>
            </tr>
          </thead>
          {tableLoading ? (
            <tbody>
              <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>
                  Carregando...
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className={styles.userTd}>
                        <Image
                          src={candidate.logo ? candidate.logo : '/user.png'}
                          alt="avatar"
                          width={40}
                          height={40}
                        />
                        <div>
                          {candidate.name && <p>{candidate.name}</p>}
                          <span>{candidate.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ justifyContent: 'center' }}>
                      {generateStatus(candidate.status)}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <Tooltip
                          content={
                            candidate.status === 'expired'
                              ? 'Reenviar convite'
                              : 'Convite ainda válido'
                          }
                        >
                          <button
                            disabled={!(candidate.status === 'expired')}
                            onClick={() => handleResendInvitation(candidate.id)}
                            type="button"
                          >
                            <AiOutlineReload fill="var(--alert)" size={25} />
                          </button>
                        </Tooltip>
                        <Tooltip
                          content={
                            candidate.aiScore
                              ? 'Correção já gerada'
                              : correctionLoading
                              ? 'Gerando correção...'
                              : candidate.status === 'finished'
                              ? 'Gerar Correção'
                              : 'Exame não finalizado ainda'
                          }
                        >
                          <button
                            disabled={
                              candidate.aiScore ||
                              !(candidate.status === 'finished') ||
                              correctionLoading
                                ? true
                                : false
                            }
                            onClick={() => {
                              if (candidate.answerSheet) {
                                handleGenerateCorrection(candidate.answerSheet);
                              }
                            }}
                            type="button"
                          >
                            <GiNotebook fill="var(--primary-2)" size={25} />
                          </button>
                        </Tooltip>
                        <Tooltip
                          content={
                            candidate.aiScore
                              ? 'Visualizar candidato'
                              : 'Gere uma correção primeiro'
                          }
                        >
                          <button
                            disabled={candidate.aiScore ? false : true}
                            onClick={() => {
                              if (candidate.answerSheet) {
                                router.push(
                                  `/reports/${candidate.answerSheet}`
                                );
                              }
                            }}
                            type="button"
                          >
                            <AiOutlineSend fill="var(--primary)" size={25} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--secondary-2)' }}>
                      Nenhum candidato encontrado
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default InvitationContainer;
