import { FC } from "react";

import Layout from "@/components/layout";
import Form from "@/components/form";

import { User } from "@/types/user";

import styles from "./styles.module.scss";
import { GetServerSideProps } from "next";

interface Props {
  user: User;
}

const Help: FC<Props> = ({user}: Props) => {
  return (
    <Layout header headerTitle="Suporte" sidebar active={2}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <h1>
            Seu feedback é muito importante para o desenvolvimento da
            plataforma.
          </h1>
          <p>
            Se você tiver alguma dúvida ou sugestão, entre em contato conosco
            pelo formulário ao lado.
          </p>
          <p>Estamos aqui para te ajudar.</p>
        </div>
        <Form user={user}/>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const { token } = req.cookies;

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const user = await userResponse.json();

  return {
    props: {
      user,
    },
  };
};

export default Help;
