import React from "react";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";

import { closeCurrentNotificationModal } from "../../../actions/NotificationsModalActions";

import Icons from "../../../icons";

import styles from "./notificationsModal.module.scss";

class NotificationsModal extends React.Component {
    close = (callback) => {
        if (callback && (typeof callback === "function")) { callback(); }

        closeCurrentNotificationModal();
    };

    render() {
        const { currentModal, className, contentClassName, ...restProps } = this.props;
        const { header, body, buttons, onClose, showSuccessIcon, showFailIcon } = currentModal || {};

        return (currentModal && (header || body))
            ? (
                <Modal isOpen={true} onClosed={() => this.close(onClose)} centered className={classnames(className, styles.notificationsDialog)} contentClassName={classnames(contentClassName, styles.content)} backdropClassName={styles.modalBackdrop} zIndex="1500" modalTransition={{ timeout: 150, exit: false }} backdropTransition={{ timeout: 150, exit: false }} {...restProps}>
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
                                    { showSuccessIcon && <img className={styles.icon} src={Icons.SuccessCheck} /> }
                                    { showFailIcon && <img className={styles.icon} src={Icons.FailedX} /> }
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
                                        onClick={() => this.close(button.callback)}
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
    }
}

const mapStateToProps = (state) => {
  return {
      currentModal: state.notificationsModal.currentModal
  };
};

export default connect(mapStateToProps)(NotificationsModal);

NotificationsModal.propTypes  = {
    currentModal: PropTypes.shape({
        header: PropTypes.any,
        body: PropTypes.any,
        buttons: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
                callback: PropTypes.func,
                className: PropTypes.string
            })
        ),
        onClose: PropTypes.func
    }),
    className: PropTypes.string,
    contentClassName: PropTypes.string
};
