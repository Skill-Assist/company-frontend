import {
  useState,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
  ChangeEvent,
} from "react";
import { useRouter } from "next/router";
import { ThreeDots } from "react-loader-spinner";

import examService from "@/services/examService";

import styles from "./styles.module.scss";
import { toast } from "react-hot-toast";

const CreateInvitation = () => {
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

    console.log(response)

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

  return (
    <div className={styles.container}>
      <div className={styles.invitationContainer}>
        <div>
          <div>
            <label>Convidar</label>
            <input
              value={value}
              placeholder='Digite ou cole os e-mail e pressione "Enter"'
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              onPaste={handlePaste}
            />
          </div>
          <div>
            <label htmlFor="expirationInHours">Expiração do convite</label>
            <input
              type="number"
              name="expirationInHours"
              id="expirationInHours"
              placeholder="Em quantas horas esse convite expira?"
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
        {error && <p>{error}</p>}
      </div>
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
    </div>
  );
};

export default CreateInvitation;
