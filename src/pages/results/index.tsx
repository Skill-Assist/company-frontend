import { FC } from "react";

import Layout from "@/components/layout";

import styles from "./styles.module.scss";

const Results: FC = () => {
  return (
    <div className={styles.container}>
      <Layout header headerTitle="Seus Resultados" sidebar active={3}>
        <div>Results</div>
      </Layout>
    </div>
  );
};

export default Results;
