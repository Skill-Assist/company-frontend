import { FC, useState, useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { BiPencil } from "react-icons/bi";
import { TbInfoSquareRounded } from "react-icons/tb";
import { toast } from "react-hot-toast";

import examService from "@/services/examService";

import { Exam } from "@/types/exam";

import styles from "./styles.module.scss";

interface Props {
  examData: Exam;
  open: () => void;
}

const ExamSideBar: FC<Props> = ({ examData, open }: Props) => {
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [toggleStatusLoading, setToggleStatusLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState([
    {
      value: "draft",
      label: "Rascunho",
      select: examData.status === "draft" ? true : false,
      currentValue: examData.status,
    },
    {
      value: "live",
      label: "Em andamento",
      select: examData.status === "live" ? true : false,
      currentValue: examData.status,
    },
    {
      value: "published",
      label: "Público",
      select: examData.status === "published" ? true : false,
      currentValue: examData.status,
    },
    {
      value: "archived",
      label: "Arquivado",
      select: examData.status === "archived" ? true : false,
      currentValue: examData.status,
    },
  ]);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const currentValue = statusOptions.filter(
      (statusOption) => statusOption.select === true
    )[0].currentValue;

    if (currentValue === examData.status) {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  }, [statusOptions]);

  const statusHandler = async () => {
    setToggleStatusLoading(true);
    const newStatus = selectRef.current?.value;

    if (!newStatus) return;

    const response = await examService.switchStatus(examData.id, newStatus);

    if (response.status >= 200 && response.status < 300) {
      toast.success("Status alterado com sucesso!", {
        duration: 3000,
        position: "top-right",
      });
      setToggleStatusLoading(false);
      setDisabledBtn(true);
    } else {
      toast.error("Erro ao alterar status!", {
        duration: 3000,
        position: "top-right",
      });
      setToggleStatusLoading(false);
      setDisabledBtn(false);
    }
  };

  return (
    <>
      <div className={styles.examHeader}>
        <div className={styles.headerTitle}>
          <h2>{examData.title && examData.title}</h2>
          <BiPencil size={25} onClick={open} />
        </div>
        <div className={styles.headerSub}>
          <p>
            {examData.subtitle && examData.subtitle}{" "}
            {examData.subtitle && examData.level && "-"}{" "}
            {examData.level && examData.level}
          </p>
        </div>
      </div>

      <h3>
        <TbInfoSquareRounded />
        Informações do exame
      </h3>
      <div className={styles.infosBox}>
        <div>
          <span>Duração:</span>
          <p>{examData.durationInHours} horas</p>
        </div>
        <div>
          <span>Tempo para submissão:</span>
          <p>{examData.submissionInHours} horas</p>
        </div>
        <div>
          <span>O candidato deve receber sua nota?</span>
          <p>{examData.showScore === true ? "Sim" : "Não"}</p>
        </div>
        <div>
          <span>O exame é público?</span>
          <p>{examData.isPublic === true ? "Sim" : "Não"}</p>
        </div>
      </div>

      <h3>
        <TbInfoSquareRounded />
        Status do exame
      </h3>
      <div className={styles.statusBox}>
        <select
          name="status"
          id="status"
          ref={selectRef}
          defaultValue={examData.status}
          onChange={(e) => {
            if (
              e.target.value === "draft" ||
              e.target.value === "archived" ||
              e.target.value === "published" ||
              e.target.value === "live"
            ) {
              const newStatus: "live" | "archived" | "draft" | "published" =
                e.target.value;

              const newStatusOptions = statusOptions.map((statusOption) => {
                if (statusOption.value === newStatus) {
                  return {
                    ...statusOption,
                    select: true,
                    currentValue: newStatus,
                  };
                } else {
                  return {
                    ...statusOption,
                    select: false,
                    currentValue: newStatus,
                  };
                }
              });

              setStatusOptions(newStatusOptions);
            }
          }}
        >
          {statusOptions.map((statusOption) => {
            return (
              <option value={statusOption.value} key={statusOption.value}>
                {statusOption.label}
              </option>
            );
          })}
        </select>
        <button disabled={disabledBtn} onClick={statusHandler} type="button">
          {toggleStatusLoading ? (
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

export default ExamSideBar;
