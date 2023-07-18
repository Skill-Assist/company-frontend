import { FC, useState, useRef, ChangeEvent } from "react";
import { ThreeDots } from "react-loader-spinner";
import { BiPencil } from "react-icons/bi";
import { TbInfoSquareRounded } from "react-icons/tb";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

import sectionService from "@/services/sectionService";

import { Section } from "@/types/section";

import styles from "./styles.module.scss";

interface Props {
  sectionData: Section;
  open: () => void;
  fetchOwnSection: () => void;
}

function formatDate(dateString: Date) {
  var date = new Date(dateString);
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
}

const SectionSideBar: FC<Props> = ({
  sectionData,
  open,
  fetchOwnSection,
}: Props) => {
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [sectionEditingloading, setSectionEditingLoading] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleCheckbox = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const sectionId = router.query.sectionId;

    let updatedSection = {};

    if (name === "isShuffleQuestions") {
      updatedSection = {
        isShuffleQuestions: checked,
      };
    } else if (name === "hasProctoring") {
      updatedSection = {
        hasProctoring: checked,
      };
    }

    if (sectionId && typeof sectionId === "string") {
      setSectionEditingLoading(true);

      const response = await sectionService.updateSection(
        sectionId,
        updatedSection
      );

      if (response.status >= 200 && response.status < 300) {
        fetchOwnSection();
        setSectionEditingLoading(false);
        toast.success("Informação atualizada com sucesso!", {
          duration: 2000,
          position: "top-right",
        });
      } else {
        setSectionEditingLoading(false);
        toast.error("Erro ao atualizar informação!", {
          duration: 2000,
          position: "top-right",
        });
      }
    }
  };

  const handleDate = async () => {
    const sectionId = router.query.sectionId;
    const enteredDate = dateRef.current?.value;

    if (sectionId && typeof sectionId === "string" && enteredDate) {
      setSectionEditingLoading(true);

      const updatedSection = {
        startDate: new Date(enteredDate),
      };

      const response = await sectionService.updateSection(
        sectionId,
        updatedSection
      );

      if (response.status >= 200 && response.status < 300) {
        fetchOwnSection();
        setSectionEditingLoading(false);
        toast.success("Data atualizada com sucesso!", {
          duration: 2000,
          position: "top-right",
        });
      } else {
        setSectionEditingLoading(false);
        toast.error("Erro ao atualizar data!", {
          duration: 2000,
          position: "top-right",
        });
      }
    }
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <div className={styles.headerTitle}>
          <h2>{sectionData.name && sectionData.name}</h2>
          <BiPencil size={25} onClick={open} />
        </div>
        <div className={styles.headerSub}>
          <p>{sectionData.description && sectionData.description}</p>
        </div>
      </div>

      <h3>
        <TbInfoSquareRounded />
        Pontos principais
      </h3>
      <div className={styles.infosBox}>
        <div>
          <span>Duração:</span>
          <p>{sectionData.durationInHours} horas</p>
        </div>
        <div>
          <span>Peso da sessão:</span>
          <p>{+sectionData.weight * 100}%</p>
        </div>
      </div>

      <h3>
        <TbInfoSquareRounded />
        Informações opicionais
      </h3>
      <div className={styles.optionalInfos}>
        <div>
          <span>Data de início:</span>
          <input
            className={styles.dateInput}
            type="date"
            name="startDate"
            id="startDate"
            defaultValue={
              sectionData.startDate ? formatDate(sectionData.startDate) : ""
            }
            ref={dateRef}
            onChange={() => setDisabledBtn(false)}
          />
        </div>
        <div>
          <span>Perguntas embaralhadas?</span>
          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="isShuffleQuestions"
              id="isShuffleQuestions"
              checked={sectionData.isShuffleQuestions}
              onChange={handleCheckbox}
            />
            <span className={styles.checkmark}></span>
          </label>
        </div>
        <div>
          <span>Proctoring ativado?</span>
          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="hasProctoring"
              id="hasProctoring"
              checked={sectionData.hasProctoring}
              onChange={handleCheckbox}
            />
            <span className={styles.checkmark}></span>
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button disabled={disabledBtn} type="button" onClick={handleDate}>
          {sectionEditingloading ? (
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
            "Salvar"
          )}
        </button>
      </div>
    </>
  );
};

export default SectionSideBar;
