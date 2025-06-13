import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="閉じる"
        >
          ×
        </button>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
