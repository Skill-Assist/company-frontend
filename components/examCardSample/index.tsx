import React, { useState } from "react";

import styles from "./styles.module.scss";
import Image from "next/image";
import EditIcon from '@mui/icons-material/Edit'

type Company = {
  name: string;
  color: string;
  logo: string;
};

type Exam = {
  id: number;
  entityName: string;
  owner: string;
  category: string;
  subCategory?: string | null;
  level?: string | null;
  durationInHours?: string | null;
  deadline?: string | null;
  isPublished: boolean;
  isLive: boolean;
  isArchived: boolean;
  status: string;
};

type Props = {
  company: Company;
  title: string;
};

let examLeftTime: string = "";

const ExamCardSample: React.FC<Props> = ({ company, title }: Props) => {
  const [hoverColor, setHoverColor] = useState(false)
  const [hoverPhoto, setHoverPhoto] = useState(false)

  return (
    <div className={styles.card}>
      <div className={styles.header} style={{ backgroundColor: `${company.color}${hoverColor ? 'ca' : ''}` }}>
        <div className={styles.photoContainer} onMouseEnter={() => setHoverPhoto(true)}
          onMouseLeave={() => setHoverPhoto(false)}>
          <Image
            className={styles.logo}
            src={company.logo}
            width={0}
            height={0}
            alt="company name"
          />
          {
            hoverPhoto && <div className={styles.editPhoto}>
              <EditIcon />
            </div>
          }
        </div>
        <div className={styles.editIcon}>
          <EditIcon onMouseEnter={() => setHoverColor(true)} onMouseLeave={() => setHoverColor(false)} />
        </div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {title}
        </h2>

        <span className={styles.company}>{company.name}</span>

        <div className={styles.info}>
          {/* <p className="status">Não iniciado</p>
          <p className={styles.deadline}>Restam X dias</p> */}
        </div>
      </div>
    </div>
  );
};

export default ExamCardSample;
