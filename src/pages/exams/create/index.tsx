import { FC } from "react";

import Layout from "@/components/layout";

import styles from "./styles.module.scss";

const CreateExam: FC = () => {
  return (
    <Layout sidebar sidebarClosed header goBack headerTitle="Criar Exame">
      <div className={styles.container}>
        <h1>Fico feliz em ver você por aqui!</h1>
      </div>
    </Layout>
  );
};

export default CreateExam;
