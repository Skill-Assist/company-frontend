import { FC } from "react";
import { useLottie } from "lottie-react";

import ComputerMan from "@public/lottie/computer-man.json";

import TouchRipple from '@mui/material/ButtonBase/TouchRipple';


import styles from "./styles.module.scss";
import Link from "next/link";
import Button from "@/components/UI/button";

interface Props {
  title: string;
  subtitle: string;
  buttonText: string;
}

const Placeholder: FC<Props> = ({
  title,
  subtitle,
  buttonText,
}: Props) => {
  const options = {
    animationData: ComputerMan,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>{title}</h1>
        <p>
          {subtitle}
        </p>
        <Button 
          type="button"
          actionType="action4"
        >
          Criar um teste
        </Button>
      </div>
      <div className={styles.view}>{View}</div>
    </div>
  );
};

export default Placeholder;
