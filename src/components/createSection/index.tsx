import { FC, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";

import styles from "./styles.module.scss";
import { Section } from "@/types/section";
import CreateSectionPlaceholder from "../Placeholders/CreateSectionPlaceholder";

interface Props {
  sections: Section[] | undefined;
}

const dropIn = {
  hidden: {
    y: "-100%",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
  },
  exit: {
    y: "-100%",
    opacity: 0,
  },
};

const CreateSection: FC<Props> = ({ sections }: Props) => {
  const [sectionsQuantity, setSectionsQuantity] = useState(0);

  console.log(sections)

  return (
    <div className={styles.container}>
      {sections && sections?.length === 0 ? (
        <CreateSectionPlaceholder />
      ) : (
        <>
          <button
            className={styles.createSectionBtn}
            onClick={() => {
              setSectionsQuantity(sectionsQuantity + 1);
            }}
          >
            <hr />
            <span>
              Criar Sessão <AiOutlinePlus />
            </span>
            <hr />
          </button>

          <div className={styles.sectionsContainer}>
            {sections
              ? sections.map((section) => {
                  return (
                    <motion.div
                      className={styles.section}
                      variants={dropIn}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      oi
                    </motion.div>
                  );
                })
              : [...Array(sectionsQuantity)].map(() => {
                  return (
                    <motion.div
                      className={styles.section}
                      variants={dropIn}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      oi
                    </motion.div>
                  );
                })}
          </div>
        </>
      )}
    </div>
  );
};

export default CreateSection;
