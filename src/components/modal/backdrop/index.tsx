import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
  onClick: () => void;
}

const Backdrop: FC<Props> = ({ children, onClick }: Props) => {
  return (
    <motion.div
      className={styles.backdrop}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
