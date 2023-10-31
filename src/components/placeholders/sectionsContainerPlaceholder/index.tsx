import { FC } from 'react';
import Lottie from 'lottie-react';

import LookingMan from '@public/lottie/looking.json';

import styles from './styles.module.scss';
import Button from '@/components/UI/button';

interface Props {
  onClick: () => void;
}

const SectionsContainerPlaceholder: FC<Props> = ({ onClick }: Props) => {
  return (
    <div className={styles.container}>
      <Lottie animationData={LookingMan} className={styles.view} />
      <div className={styles.content}>
        <h1>Ainda não existem seções para o seu teste...</h1>
        <p>
          Para começar a criar seu teste, é necessário que você crie pelo menos
          1 seção. As seções são etapas do teste e representam um conjunto
          organizado de questões. Ah, e você pode criar quantas seções quiser!
          <br />
          <br />
          <span>Vamos começar a criar?</span>
        </p>
        <Button
          backgroundColor="var(--green-3)"
          fontColor="var(--green-1)"
          type="button"
          dimensions={{ width: '260px', height: '60px' }}
          fontSize="20px"
          onClick={onClick}
        >
          Criar seção
        </Button>
      </div>
    </div>
  );
};

export default SectionsContainerPlaceholder;
