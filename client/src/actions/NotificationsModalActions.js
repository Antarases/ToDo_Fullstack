import apolloClient from "../apolloClient";

import { SHOW_NOTIFICATION_MODAL, CLOSE_CURRENT_NOTIFICATION_MODAL } from "../constants/graphqlQueries/notificationsModal";

export const showNotificationModal = (modal) => {
    apolloClient.mutate({
        mutation: SHOW_NOTIFICATION_MODAL,
        variables: {
            modal
        }
    });
};

export const closeCurrentNotificationModal = () => {
    apolloClient.mutate({
        mutation: CLOSE_CURRENT_NOTIFICATION_MODAL
    });
};
