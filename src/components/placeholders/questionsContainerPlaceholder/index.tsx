import { useLottie } from "lottie-react";

import LookingMan from "@public/lottie/looking.json";

import styles from "./styles.module.scss";
import { FC } from "react";

interface Props {
  open: (content: "manual" | "ai") => void;
}

const QuestionsContainerPlaceholder: FC<Props> = ({ open }: Props) => {
  const options = {
    animationData: LookingMan,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Sem questões no momento...</h1>
        <p>
          Sabemos que a criação de questões é a parte mais cansativa do processo de elaboraração de
          um teste, por isso, desenvolvemos formas de você criar questões de
          maneira mais rápida e fácil.
        </p>
        <p>
          Você pode criar questões manualmente ou de forma automática, com
          auxílio de Inteligência Artificial.
        </p>
        <div className={styles.stroke}>
          <button onClick={() => open("manual")}>Manual</button>
          <button onClick={() => open("ai")}>IA</button>
        </div>
      </div>
      <div className={styles.view}>{View}</div>
    </div>
  );
};

export default QuestionsContainerPlaceholder;
