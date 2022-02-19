import React from "react";
import { useQuery } from "@apollo/client";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";

import Icons from "../../../icons";

import { closeCurrentNotificationModal } from "../../../actions/NotificationsModalActions";

import { GET_CURRENT_NOTIFICATION_MODAL } from "../../../constants/graphqlQueries/notificationsModal";

import styles from "./notifications-modal.module.scss";

const close = (callback) => {
    if (callback && (typeof callback === "function")) { callback(); }

    closeCurrentNotificationModal();
};

const NotificationsModal = ({ className, contentClassName, ...restProps }) => {
    const { data: currentModalData } = useQuery(GET_CURRENT_NOTIFICATION_MODAL);
    const currentModal = currentModalData.clientData.notificationsModal.currentModal;
    const { header, body, buttons, onClose, showSuccessIcon, showFailIcon, closeOnBackdropClick } = currentModal || {};

    return (currentModal && (header || body))
        ? (
            <Modal
                isOpen={true}
                onClosed={() => close(onClose)}
                toggle={() => closeOnBackdropClick && close(onClose)}
                centered
                className={classnames(className, styles.notificationsDialog)}
                contentClassName={classnames(contentClassName, styles.content)}
                backdropClassName={styles.modalBackdrop}
                zIndex="1500"
                modalTransition={{ timeout: 150, exit: false }}
                backdropTransition={{ timeout: 150, exit: false }}
                {...restProps}
            >
                {
                    header
                    && <ModalHeader>{ header }</ModalHeader>
                }

                {
                    body
                    && <ModalBody className={styles.modalBody}>
                        {
                            (showSuccessIcon || showFailIcon)
                            && <div className={styles.icons}>
                                { showSuccessIcon && <img className={styles.icon} src={Icons.SuccessCheck} alt="" /> }
                                { showFailIcon && <img className={styles.icon} src={Icons.FailedX} alt="" /> }
                            </div>
                        }

                        <div className={styles.bodyContent}>{ body }</div>
                    </ModalBody>
                }

                {
                    (buttons && !!buttons.length)
                    && <ModalFooter className={styles.footer}>
                        {
                            buttons.map((button, index) => (
                                <Button
                                    className={classnames(button.className, styles.footerButton)}
                                    onClick={() => close(button.callback)}
                                    key={index}
                                    color="primary"
                                    size="sm"
                                >
                                    { button.text }
                                </Button>
                            ))
                        }
                    </ModalFooter>
                }
            </Modal>
        )
        : null;
};

export default NotificationsModal;

NotificationsModal.propTypes  = {
    className: PropTypes.string,
    contentClassName: PropTypes.string
};
