import { useState, FC } from "react";
import styles from "./styles.module.scss";

type Item = {
  title: String;
}

type Props = {
  actualStep: number;
  changeStep: (step: number) => void;
}

const StepBar: FC<Props> = ({actualStep, changeStep}) => {
  const steps = [
    {
      title: 'Geral',
    },
    {
      title: 'Estrutura',
    },
    {
      title: 'Seção',
    },
    {
      title: 'Questão',
    },
    {
      title: 'Resumo',
    }
  ]

  return <div className={styles.stepBar}>
    <div className={styles.container}>
      <div className={styles.line}></div>
      <div className={styles.items}>
        {
          steps.map((item: Item, index: number) => {
            return (
              <div
                className={`${styles.item} ${index === actualStep && styles.active}`}
                onClick={() => changeStep(index)}
                key={index}
              >
                <div className={styles.circle}></div>
                <div className={styles.title}>{item.title}</div>
              </div>
            )
          })
        }
      </div>
    </div>
  </div>
}
export default StepBar;
