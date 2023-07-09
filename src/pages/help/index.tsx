import { FC } from "react";

import Layout from "@/components/layout";

import styles from "./styles.module.scss";

const Help: FC = () => {
  return (
    <div className={styles.container}>
      <Layout header headerTitle="Suporte" sidebar active={4}>
        <div>Suporte</div>
      </Layout>
    </div>
  );
};

export default Help;
