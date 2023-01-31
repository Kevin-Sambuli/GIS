import {createSlice, current} from '@reduxjs/toolkit';

const initialAuthState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        loginSuccess(state, action) {
            localStorage.setItem('access', action.payload.access);
            localStorage.setItem('refresh', action.payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: action.payload.access,
                refresh: action.payload.refresh
            };
            console.log(current(state));
        },
        googleAuthSuccess(state, action) {
            localStorage.setItem('access', action.payload.access);
            localStorage.setItem('refresh', action.payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: action.payload.access,
                refresh: action.payload.refresh
            }
        },
        facebookAuthSuccess(state, action) {
            localStorage.setItem('access', action.payload.access);
            localStorage.setItem('refresh', action.payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: action.payload.access,
                refresh: action.payload.refresh
            }
        },
        loginFail(state) {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            };
        },
        registerUser(state) {
            return {
                ...state,
                isAuthenticated: false
            }
        },
        registerUserFail(state) {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
        },
        userLoadedSuccess(state, action) {
            return {
                ...state,
                user: action.payload
            }
        },
        userLoadedFail(state, action) {
            return {
                ...state,
                isAuthenticated: false,
                user: null
            }
        },
        authenticatedSuccess(state) {
            return {
                ...state,
                isAuthenticated: true
            }
        },
        authenticatedFail(state) {
            return {
                ...state,
                isAuthenticated: false
            }
        },
        logout(state) {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
        },
        passwordResetSuccess(state) {
            return {
                ...state,
            }
        },
        passwordResetFail(state) {
            return {
                ...state,
            }
        },
        passwordResetConfirmSuccess(state) {
            return {
                ...state,
            }
        },
        passwordResetConfirmFail(state) {
            return {
                ...state,
            }
        },
        accountActivationSuccess(state) {
            return {
                ...state,
            }
        },
        accountActivationFail(state) {
            return {
                ...state,
            }
        },
        tokenRefresh(state, action) {
            localStorage.setItem('access', action.payload.access);
            localStorage.setItem('refresh', action.payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: action.payload.access,
                refresh: action.payload.refresh
            };
            console.log(current(state));
        },
    },
});

export default authSlice;

export const authActions = authSlice.actions;