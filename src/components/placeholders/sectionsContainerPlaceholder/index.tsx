import { FC } from 'react';
import { useLottie } from 'lottie-react';

import LookingMan from '@public/lottie/looking.json';

import styles from './styles.module.scss';

interface Props {
  onClick: () => void;
}

const SectionsContainerPlaceholder: FC<Props> = ({ onClick }: Props) => {
  const options = {
    animationData: LookingMan,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Nenhuma seção criada até agora...</h1>
        <p>
          Seções são as etapas do seu teste e representam um conjunto organizado
          de questões. Você pode criar quantas seções quiser!
        </p>
        <button onClick={onClick}>Criar seção</button>
      </div>
      <div className={styles.view}>{View}</div>
    </div>
  );
};

export default SectionsContainerPlaceholder;
