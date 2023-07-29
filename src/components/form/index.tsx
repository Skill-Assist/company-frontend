import { useState, FormEvent, FC } from "react";

import { useRouter } from "next/router";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

import { User } from "@/types/user";

import styles from "./styles.module.scss";

interface Props {
  user: User;
}

const Form: FC<Props> = ({user}: Props) => {
  const [submited, setSubmited] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function submitHandler(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.target as HTMLFormElement);

    try {
      await axios.post(
        "https://docs.google.com/forms/d/e/1FAIpQLScMXd4c2Wh5XYiwq1rhZa5GHYrWp9ytOy6aDaojS9Vt5dNIew/formResponse",
        data
      );

      setSubmited(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setSubmited(true);
      setLoading(false);
    }
  }

  return (
    <>
      <form className={styles.formContainer} onSubmit={submitHandler}>
        <fieldset>
          <label htmlFor="entry.959855310">Nome completo:</label>
          <input
            required
            defaultValue={user.name}
            type="hidden"
            name="entry.959855310"
          />
          <input
            style={{opacity: 0.5, cursor: "not-allowed"}}
            defaultValue={user.name}
            type="text"
            disabled
          />
        </fieldset>

        <fieldset>
          <label htmlFor="entry.1924770189">E-mail:</label>
          <input
            required
            defaultValue={user.email}
            type="hidden"
            name="entry.1924770189"
          />
          <input
            style={{opacity: 0.5, cursor:"not-allowed"}}
            defaultValue={user.email}
            type="email"
          />
        </fieldset>

        <fieldset>
          <label htmlFor="entry.289631481">Assunto:</label>
          <input
            required
            placeholder="Insira um assunto"
            type="text"
            name="entry.289631481"
          />
        </fieldset>

        <fieldset>
          <label htmlFor="entry.1594245412">Mensagem:</label>
          <textarea
            placeholder="Digíte sua mensagem aqui"
            name="entry.1594245412"
            required
          />
        </fieldset>
        <button type="submit">
          {loading ? (
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
            "Enviar"
          )}
        </button>
        {!loading && submited && (
          <p className={styles.congrats}>
            Obrigado pela mensagem! <br />
            Entraremos em contato em breve!
          </p>
        )}
      </form>
    </>
  );
};

export default Form;
