import { gql } from "@apollo/client";

export const SHOW_NOTIFICATION_MODAL = gql`
    mutation ShowNotificationModal($modal: Object) {
        notificationsModal__show(modal: $modal) @client
    }
`;

export const CLOSE_CURRENT_NOTIFICATION_MODAL = gql`
    mutation CloseCurrentNotificationModal {
        notificationsModal__close @client
    }
`;

export const GET_CURRENT_NOTIFICATION_MODAL = gql`
    query GetCurrentNotificationModal {
        clientData {
            notificationsModal {
                currentModal
            }
        }
    }
`;
