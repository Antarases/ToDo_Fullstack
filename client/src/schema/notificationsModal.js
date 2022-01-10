import { gql } from "@apollo/client";

import { initialData } from "./index";

const notificationModalResolvers = {
    Mutation: {
        notificationsModal__show: (parent, { modal }, { cache }) => {
            const query = gql`
                query ShowNotificationsModal {
                    clientData @client {
                        notificationsModal {
                            queue
                            currentModal
                            __typename
                        }
                        __typename
                    }
                }
            `;

            const queryResults = cache.readQuery({ query });
            const newQueue = [
                ...queryResults.clientData.notificationsModal.queue,
                {
                    header: modal.header,
                    body: modal.body,
                    buttons: modal.buttons,
                    onClose: modal.onClose,
                    showSuccessIcon: modal.showSuccessIcon,
                    showFailIcon: modal.showFailIcon
                }
            ];
            const newData = {
                clientData: {
                    notificationsModal: {
                        queue: newQueue,
                        currentModal: newQueue[0],
                        __typename: "NotificationsModal"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
        notificationsModal__close: (parent, args, { cache }) => {
            const query = gql`
                query CloseNotificationsModal {
                    clientData @client {
                        notificationsModal {
                            queue
                            currentModal
                            __typename
                        }
                        __typename
                    }
                }
            `;

            const queryResults = cache.readQuery({ query });
            let newQueue = [...queryResults.clientData.notificationsModal.queue];
            newQueue.shift();

            const newData = {
                clientData: {
                    notificationsModal: {
                        queue: newQueue,
                        currentModal: newQueue[0] || initialData.clientData.notificationsModal.currentModal,
                        __typename: "NotificationsModal"
                    },
                    __typename: "ClientData"
                }
            };

            cache.writeQuery({ query, data: newData });
        },
    }
};

export default notificationModalResolvers;
