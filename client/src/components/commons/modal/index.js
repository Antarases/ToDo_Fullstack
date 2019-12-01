import React from "react";
import { Modal as ReactstrapModal, ModalBody } from "reactstrap";
import classnames from "classnames";

import styles from "./modal.module.scss";

const Modal = ({ children, isOpen, toggleModal, className, disableFadeEffect = false, ...restProps }) => {
    const childrenWithExtraProps = React.Children.map(children, child => {
        return React.isValidElement(child)
            ? React.cloneElement(child, {
                toggleModal
            })
            : child;
    });

    return (
        <ReactstrapModal isOpen={isOpen} centered toggle={toggleModal} className={classnames(className, styles.modalDialog)} contentClassName={styles.content} backdropClassName={styles.modalBackdrop} modalTransition={{ timeout: 150, exit: !disableFadeEffect }} backdropTransition={{ timeout: 150, exit: !disableFadeEffect }} {...restProps}>
            <ModalBody className={styles.modalBody}>
                {childrenWithExtraProps}
            </ModalBody>
        </ReactstrapModal>
    );
};

export default Modal;
