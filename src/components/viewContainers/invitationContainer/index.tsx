import {
  useState,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { Tooltip } from "@nextui-org/react";
import { ThreeDots } from "react-loader-spinner";
import { AiOutlineReload, AiOutlineSend } from "react-icons/ai";
import { GiNotebook } from "react-icons/gi";

import examService from "@/services/examService";

import styles from "./styles.module.scss";
import Image from "next/image";

const InvitationContainer = () => {
  const [invitationLoading, setInvitationLoading] = useState(false);

  const [emails, setEmails] = useState<string[]>([]);
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const expirationInHoursInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>): void => {
    if (["Enter", "Tab", ",", " "].includes(evt.key)) {
      evt.preventDefault();

      const trimmedValue = value.trim();

      if (trimmedValue && isValid(trimmedValue)) {
        setEmails([...emails, trimmedValue]);
        setValue("");
      }
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

    const paste = evt.clipboardData.getData("text");
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

  const invitationHandler = async () => {
    setInvitationLoading(true);

    const examId = router.query.examId;
    const enteredExpirationInHours = expirationInHoursInputRef.current?.value;

    if (!examId || typeof examId !== "string") {
      setError("Erro ao buscar o exame!");
      setInvitationLoading(false);
      return;
    }

    if (!enteredExpirationInHours) {
      setError("Digite um valor para a expiração do convite!");
      setInvitationLoading(false);
      return;
    }

    const invitationData = {
      email: emails,
      expirationInHours: +enteredExpirationInHours,
    };

    const response = await examService.sendInvitation(examId, invitationData);

    console.log(response);

    if (response.status >= 200 && response.status < 300) {
      toast.success("Convite enviado com sucesso!");
      setInvitationLoading(false);
      setEmails([]);
      setValue("");
      setError(null);
    } else {
      toast.error("Erro ao enviar convite!");
      setInvitationLoading(false);
    }
  };

  useEffect(() => {
    const examId = router.query.examId;

    if (examId || typeof examId === "string") {
      const fetchInvitations = async () => {
        const examId = router.query.examId;

        if (examId && typeof examId === "string") {
          const response = await examService.getInvitation(examId);

          console.log(response);
        }
      };

      fetchInvitations();
    }
  }, []);

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
              id="emails"
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
            onClick={invitationHandler}
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
              `Enviar convite${emails.length > 1 ? "s" : ""}`
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
                <span style={{ justifySelf: "center", marginRight: "18px" }}>
                  Status
                </span>
              </th>
              <th>
                <span style={{ justifySelf: "center", marginRight: "18px" }}>
                  Ações
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className={styles.userTd}>
                  <Image src="/user.png" alt="avatar" width={40} height={40} />
                  <div>
                    <p>Sarah Doe</p>
                    <span>sarah.doe@example.com</span>
                  </div>
                </div>
              </td>
              <td style={{ justifyContent: "center" }}>
                <p className={styles.status}>Aprovado</p>
              </td>
              <td>
                <div className={styles.rowActions}>
                  <Tooltip content={"Reenviar convite"}>
                    <button type="button">
                      <AiOutlineReload fill="var(--alert)" size={25} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Gerar Correção">
                    <button disabled type="button">
                      <GiNotebook fill="var(--primary-2)" size={25} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Visualizar candidato">
                    <button type="button">
                      <AiOutlineSend fill="var(--primary)" size={25} />
                    </button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvitationContainer;
