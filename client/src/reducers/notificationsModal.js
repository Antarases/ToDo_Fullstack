const initialState = {
    queue: [],
    currentModal: false
};

export default function dialogs(state = initialState, action) {
    switch (action.type) {
        case "NOTIFICATIONS_MODAL__SHOW": {
            let newQueue = [...state.queue, action.modal];
            return {
                ...state,
                queue: newQueue,
                currentModal: newQueue[0]
            };
        }

        case "NOTIFICATIONS_MODAL__CLOSE": {
            let newQueue = [...state.queue];
            newQueue.shift();
            return {
                ...state,
                queue: newQueue,
                currentModal: newQueue[0]
            };
        }

        case "CLEAR_STATE": {
            return {
                ...initialState
            };
        }

        default:
            return state;
    }
}
