import React, { useState } from "react";
import styles from "./styles.module.scss";

type Item = {
  title: String;
}

const StepBar: React.FC = () => {
  const [actualStep, setActualStep] = useState(0)

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
                onClick={() => setActualStep(index)}
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
