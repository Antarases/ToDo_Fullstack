import { dispatch } from "../store/configureStore";

export function showNotificationModal(header, body, buttons, onClose, showSuccessIcon = false, showFailIcon = false) {
    dispatch({
        type: "NOTIFICATIONS_MODAL__SHOW",
        modal: { header, body, buttons, onClose, showSuccessIcon, showFailIcon }
    });
}

export function closeCurrentNotificationModal() {
    dispatch({ type: "NOTIFICATIONS_MODAL__CLOSE" });
}
