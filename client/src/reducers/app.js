const initialState = {
    currentUserStatus: {
        isLoggedIn: false,
        isAdmin: false
    },
    isUserLoginStatusDetermining: true
};

export const SET_CURRENT_USER = "SET_CURRENT_USER";
export const SET_USER_LOGIN_STATUS_DETERMINING = "SET_USER_LOGIN_STATUS_DETERMINING";

export default function app(state = initialState, action ) {
    switch (action.type) {
        case SET_CURRENT_USER: {
            const { user } = action;

            return {
                ...state,
                currentUserStatus: {
                    ...state.currentUserStatus,
                    isLoggedIn: !!user,
                    isAdmin: (user && user.isAdmin)
                }
            };
        }
        case SET_USER_LOGIN_STATUS_DETERMINING: {
            return {
                ...state,
                isUserLoginStatusDetermining: action.isUserLoginStatusDetermining
            };
        }
        default:
            return state;
    }
};

