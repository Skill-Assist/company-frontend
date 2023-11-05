import { FC } from 'react';
import Lottie from 'lottie-react';

import LookingMan from '@public/lottie/looking.json';

import styles from './styles.module.scss';
import Button from '@/components/UI/button';

interface Props {
  onClick: () => void;
  title: string;
  description: string;
  buttonText: string;
}

const NoContentPlaceholder: FC<Props> = ({
  onClick,
  title,
  description,
  buttonText,
}: Props) => {
  return (
    <div className={styles.container}>
      <Lottie animationData={LookingMan} className={styles.view} />
      <div className={styles.content}>
        <h1>{title}</h1>
        <p>
          {description}
          <br />
          <br />
          <span>Vamos começar a criar?</span>
        </p>
        <Button
          type="button"
          dimensions={{ width: '260px', height: '60px' }}
          onClick={onClick}
          actionType="confirm"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default NoContentPlaceholder;
