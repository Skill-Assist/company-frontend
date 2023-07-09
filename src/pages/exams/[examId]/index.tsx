import { GetServerSideProps } from "next";
import { FC } from "react";

import styles from "./index.module.scss";
import Layout from "@/components/layout";

interface Props {
    examId: string;
}

const ExamPage: FC<Props> = ({examId} :Props) => {
  return (
    <p>oi</p>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { examId } = context.params as { examId: string };

  return {
    props: {
      examId,
    },
  };
};

export default ExamPage;
