import { useLottie } from "lottie-react";

import ComputerMan from "@public/lottie/computer-man.json";

import styles from "./styles.module.scss";

const Placeholder = () => {
  const options = {
    animationData: ComputerMan,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Ops, parece que você ainda não tem nenhum exame</h1>
        <p>
          Clique no botão abaixo para criar um novo exame
        </p>
        <button className={styles.button}>Criar exame</button>
      </div>
      <div className={styles.view}>{View}</div>
    </div>
  );
};

export default Placeholder;
