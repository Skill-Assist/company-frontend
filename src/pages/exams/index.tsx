import { useEffect, useState, FC } from "react";
import { AiFillPlusCircle } from "react-icons/ai";

import Layout from "@/components/layout";
import Search from "@/components/search";
import Placeholder from "@/components/placeholder";
import CardsRow from "@/components/cardsRow";

import examService from "@/services/examService";

import { Exam } from "@/types/exam";
import { User } from "@/types/user";

import styles from "./styles.module.scss";
import userService from "@/services/userService";
import Link from "next/link";

const Exams: FC = () => {
  const [loading, setLoading] = useState(true);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [cardsRows, setCardsRows] = useState<
    {
      title: string;
      owner: User;
      cards: Exam[];
      placeholder: string;
      open: boolean;
    }[]
  >([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let ownedExamsResponse = (await examService.getOwnedExams()).reverse();
      let profileExamsResponse = await userService.getProfile();

      setAllExams(ownedExamsResponse);

      let liveExamsData = ownedExamsResponse.filter(
        (exam: Exam) => exam.status === "live"
      );

      let draftExamsData = ownedExamsResponse.filter(
        (exam: Exam) => exam.status === "draft"
      );

      let archivedExamsData = ownedExamsResponse.filter(
        (exam: Exam) => exam.status === "archived"
      );

      setCardsRows([
        {
          title: "Em andamento",
          owner: profileExamsResponse,
          cards: liveExamsData,
          open: true,
          placeholder: "Você ainda não possui testes em andamento",
        },
        {
          title: "Rascunhos",
          owner: profileExamsResponse,
          cards: draftExamsData,
          open: true,
          placeholder: "Você ainda não possui rascunhos",
        },
        {
          title: "Arquivados",
          owner: profileExamsResponse,
          cards: archivedExamsData,
          open: true,
          placeholder: "Você ainda não possui testes arquivados",
        },
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleRow = (index: number) => {
    setCardsRows(
      cardsRows.map((row, i) => {
        if (i === index) {
          row.open = !row.open;
        } else {
          row.open = row.open;
        }

        return row;
      })
    );
  };

  return (
    <Layout sidebar header headerTitle="Seus Exames" active={1}>
      <div className={styles.container}>
        {!loading && allExams.length === 0 ? (
          <Placeholder
            title="Ops, parece que você ainda não tem nenhum exame"
            subtitle="Clique no botão abaixo para criar um novo exame"
            buttonText="Criar exame"
          />
        ) : (
          <>
            <div className={styles.contentHeader}>
              <Search
                search={search}
                onSearch={setSearch}
                placeholder="Pesquisar convites"
              />
              <Link href={`/exams/create`}>
                <AiFillPlusCircle size={25} fill="var(--primary)" />
                <span>Novo Exame</span>
              </Link>
            </div>

            {cardsRows.map((row, index) => (
              <CardsRow
                key={index}
                title={row.title}
                loading={loading}
                owner={row.owner}
                cards={row.cards}
                open={row.open}
                index={index}
                placeholder={row.placeholder}
                toggleRow={toggleRow}
              />
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Exams;
