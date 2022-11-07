import { useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './Modal.module.css';

const Modal = ({closeModal, largeUrl}) => {
  const onBackdropClick = ev => {
    if (ev.currentTarget === ev.target) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeydown);
  })

  const onKeydown = ev => {
    if (ev.code === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('keydown', onKeydown);
    }
  })

    return (
      <div className={styles.overlay} onClick={onBackdropClick}>
        <div className={styles.modal}>
          <img src={largeUrl} alt="" />
        </div>
      </div>
    );
};

export default Modal;

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  largeUrl: PropTypes.string.isRequired,
};