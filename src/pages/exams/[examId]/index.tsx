import { FC } from "react";
import { GetServerSideProps } from "next";

import Layout from "@/components/layout";

import { Exam } from "@/types/exam";

import styles from "./styles.module.scss";

interface Props {
  examData: Exam;
}

const ExamPage: FC<Props> = ({ examData }: Props) => {
  return (
    <Layout sidebar sidebarClosed header headerTitle={examData.title}>
      <div className={styles.container}>
        oi
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const { token } = req.cookies;
  const { examId } = context.params as { examId: string };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/exam/findOne?key=id&value=${examId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return {
    props: {
      examData: data,
    },
  };
};

export default ExamPage;
