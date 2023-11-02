import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import CloseIcon from '@public/icons/fa/close.svg';

import Backdrop from './backdrop';

import styles from './styles.module.scss';

interface Props {
  handleClose: () => void;
  children: ReactNode;
  dimensions?: {
    width: string;
    height: string;
  };
  sidebarOn?: boolean;
  closeIcon?: boolean;
}

const dropIn = {
  hidden: {
    y: '100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
};

const Modal: FC<Props> = ({
  handleClose,
  children,
  dimensions,
  sidebarOn,
  closeIcon,
}: Props) => {
  const classes = {
    width: dimensions?.width || 'auto',
    height: dimensions?.height || 'auto',
    marginLeft: sidebarOn ? '256px' : '0',
  };

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={styles.modal}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={classes}
      >
        {closeIcon && (
          <Image
            src={CloseIcon}
            height={21}
            width={21}
            alt="close_icon"
            className={styles.closeIcon}
            onClick={handleClose}
          />
        )}
        {children}
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
