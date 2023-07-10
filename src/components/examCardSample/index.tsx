import { FC, useEffect, useRef, useState } from "react";

import { SketchPicker } from "react-color";

import styles from "./styles.module.scss";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";

type Company = {
  name: string;
  color: string | null;
  logo: string | null;
};

type Props = {
  company: Company;
  title: string;
  changeColor: (color: string) => void;
  changePhoto: (file: any) => void;
};

const ExamCardSample: FC<Props> = ({
  company,
  title,
  changeColor,
  changePhoto,
}: Props) => {
  const [hoverColor, setHoverColor] = useState(false);
  const [hoverPhoto, setHoverPhoto] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handlePicker = (picker: any) => {
    let hex = picker.hex;
    let alpha = Math.round(picker.rgb.a * 255).toString(16);

    if (alpha.length < 2) alpha = "0" + alpha;

    changeColor(hex + alpha);
  };

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowPicker(false);
        }
      };
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div className={styles.card}>
      <div
        className={styles.header}
        style={{ backgroundColor: `${company.color}${hoverColor ? "ca" : ""}` }}
      >
        <div
          className={styles.photoContainer}
          onMouseEnter={() => setHoverPhoto(true)}
          onMouseLeave={() => setHoverPhoto(false)}
        >
          {/* {
              company.logo ? <img
              className={styles.logo}
              src={`${company.logo}?`+new Date().getTime()}
              width={0}
              height={0}
              alt="company Logo"
            />
            :
            <Image
              className={styles.logo}
              src={defaultLogo}
              width={0}
              height={0}
              alt="company Logo"
            />
            }
          {
            hoverPhoto && <label className={styles.editPhoto} >
              <EditIcon />
              <input type="file" accept="image/*" onChange={(e) => changePhoto(e)}/>
            </label>
          }
            */}
        </div>
        <div className={styles.editIcon}>
          <EditIcon
            onMouseEnter={() => setHoverColor(true)}
            onMouseLeave={() => setHoverColor(false)}
            onClick={() => setShowPicker(true)}
          />
          {showPicker && (
            <div ref={wrapperRef} className={styles.picker}>
              <SketchPicker
                color={company.color || "#ffffff"}
                onChange={(picker: any) => handlePicker(picker)}
              />
              {/* <HexColorPicker color={company.color} onChange={changeColor}/> */}
            </div>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

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
