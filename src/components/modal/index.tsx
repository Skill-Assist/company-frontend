import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

import Backdrop from "./backdrop";

import styles from "./styles.module.scss";

interface Props {
  handleClose: () => void;
  children: ReactNode;
  dimensions?: {
    width: string;
    height: string;
  }
}

const dropIn = {
  hidden: {
    y: "100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const Modal: FC<Props> = ({ handleClose, children, dimensions }: Props) => {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={styles.modal}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={dimensions && {width: dimensions.width, height: dimensions.height}}
      >
        {children}
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
