import Layout from "@/components/layout";
import { useEffect, useState, FC } from "react";
import styles from "./styles.module.scss";

import { Exam } from "@/types/exam";
import examService from "@/services/examService";
import Search from "@/components/search";
import Placeholder from "@/components/placeholder";

const Invitations: FC = () => {
  const [loading, setLoading] = useState(true);
  const [ownedExams, setOwnedExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let ownedExamsResponse = await examService.getOwnedExams();
      setOwnedExams(ownedExamsResponse);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Layout sidebar footer header headerTitle="Seus Exames" active={1}>
      <div className={styles.container}>
        {!loading && ownedExams.length !== 0 ? (
          <Placeholder />
        ) : (
          <Search
            search={search}
            onSearch={setSearch}
            placeholder="Pesquisar convites"
          />
        )}
      </div>
    </Layout>
  );
};

export default Invitations;
