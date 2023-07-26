import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "@/components/layout";

import styles from "./styles.module.scss";
import examService from "@/services/examService";
import Image from "next/image";
import { AiFillCalendar } from "react-icons/ai";
import ScoredSection from "@/components/scoredSection";
import sectionService from "@/services/sectionService";
import { SectionToAnswerSheet } from "@/types/sectionToAnswerSheet";

const ReportPage = () => {
  const [answerSheet, setAnswerSheet] = useState<any>();
  const [sections, setSections] = useState<SectionToAnswerSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    const { answerSheetId } = router.query;
    setLoading(true);
    if (answerSheetId && typeof answerSheetId === "string") {
      // GET ANSWER SHEET
      const answerSheetResponse = await examService.getAnswerSheet(
        answerSheetId
      );

      if (
        answerSheetResponse.status >= 200 &&
        answerSheetResponse.status < 300
      ) {
        setAnswerSheet(answerSheetResponse.data[0]);

        // GET SECTIONS TO ANSWER SHEET
        const sectionsToAnswerSheet =
          await sectionService.getSectionsToAnswerSheet(
            answerSheetResponse.data[0].__sectionToAnswerSheets__
          );

        setSections(() => {
          const sections = sectionsToAnswerSheet.map((section: SectionToAnswerSheet) => {
            return {
              ...section,
              open: true,
            };
          });

          return sections;
        });

        setLoading(false);
      } else {
        alert("Erro ao carregar relatório");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleSection = (index: number) => {
    setSections(
      sections.map((section, i) => {
        if (i === index) {
          section.open = !section.open;
        } else {
          section.open = section.open;
        }

        return section;
      })
    );
  };

  if (loading) {
    return <p>carregando</p>;
  }

  const readableStartDate = new Date(answerSheet.startDate).toLocaleDateString(
    "pt-BR",
    {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }
  );

  const readableEndDate = new Date(answerSheet.endDate).toLocaleDateString(
    "pt-BR",
    {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }
  );

  return (
    <Layout header goBack sidebar sidebarClosed active={10}>
      <div className={styles.container}>
        <header>
          <div>
            <div className={styles.infos}>
              <div>
                <Image
                  src={answerSheet.__user__.logo}
                  width={300}
                  height={300}
                  alt="profile_logo"
                />
              </div>
              <div>
                <h2>{answerSheet.__user__.name}</h2>
                <p>{answerSheet.__user__.email}</p>
              </div>
            </div>
            <h1 className={styles.title}>
              {answerSheet.__exam__.title && answerSheet.__exam__.title}{" "}
              {answerSheet.__exam__.subtitle && answerSheet.__exam__.subtitle}{" "}
              {answerSheet.__exam__.subtitle &&
                answerSheet.__exam__.level &&
                "-"}{" "}
              {answerSheet.__exam__.level && answerSheet.__exam__.level}
            </h1>
            <div className={styles.dates}>
              <p>
                <AiFillCalendar size={20} />
                Teste começado em {readableStartDate}
              </p>
              <p>
                <AiFillCalendar size={20} /> Teste finalizado em{" "}
                {readableEndDate}
              </p>
            </div>
          </div>
          <div className={styles.score}>
            <h2>Nota geral</h2>
            <h1>{(+answerSheet.aiScore * 10).toFixed(2)}</h1>
          </div>
        </header>
        <main className={styles.main}>
          {sections.map((section, index) => (
            <ScoredSection
              key={index}
              section={section.__section__}
              sectionScore={section.aiScore}
              loading={loading}
              rows={section.__answers__}
              open={section.open}
              index={index}
              toggleSection={toggleSection}
            />
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default ReportPage;
