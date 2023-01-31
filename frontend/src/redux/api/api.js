import axios from 'axios';
import axiosBase from "../../utils/axiosInstance";

import {authActions} from "../actions/authSlice";


//checks if the user is already authenticated by the access token
export const loadUser = () => {
    return async (dispatch) => {
        if (localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json'
                }
            };

            try {
                // return the user object from the database
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);

                dispatch(authActions.userLoadedSuccess(res.data));

                // console.log(res.data);
            } catch (err) {
                console.log("user fail", err);
                dispatch(authActions.userLoadedFail());
            }
        } else {
            dispatch(authActions.userLoadedFail());
        }
    };
};

// export const googleAuthenticate = (state, code) => async dispatch => {
//     if (state && code && !localStorage.getItem('access')) {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         };
//
//         const details = {
//             'state': state,
//             'code': code
//         };
//
//         const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
//
//         try {
//             const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?${formBody}`, config);
//             console.log(res)
//
//             // dispatch(authActions.googleAuthSuccess({
//             //         access: data.access,
//             //         refresh: data.refresh,
//             //     })
//             // );
//
//             dispatch(loadUser());
//         } catch (err) {
//             dispatch(authActions.loginFail());
//         }
//     }
// };

// export const facebookAuthenticate = (state, code) => async dispatch => {
//     if (state && code && !localStorage.getItem('access')) {
//         const config = {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         };
//
//         const details = {
//             'state': state,
//             'code': code
//         };
//
//         const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
//
//         try {
//             const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?${formBody}`, config);
//
//             dispatch({
//                 type: FACEBOOK_AUTH_SUCCESS,
//                 payload: res.data
//             });
//
//             dispatch(load_user());
//         } catch (err) {
//             dispatch({
//                 type: FACEBOOK_AUTH_FAIL
//             });
//         }
//     }
// };


export const registerUser = (first_name, last_name, email, username, password, re_password) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({first_name, last_name, email, username, password, re_password});

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, body, config);

            dispatch(authActions.registerUser(res.data));

        } catch (err) {
            // console.log(err);
            dispatch(authActions.registerUserFail());
        }
    };
};

export const verifyAccount = (uid, token) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({uid, token});

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config);
            // await axios.post(`auth/users/activation/`, body, config);

            dispatch(authActions.accountActivationSuccess());
        } catch (err) {
            dispatch(authActions.accountActivationFail());
        }
    };
}

//the function checks if the user is already authenticated by checking access token in the local storage and returns the user object
export const checkAuthenticated = () => {
    return async (dispatch) => {
        if (localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 'Authorization': `JWT ${localStorage.getItem('access')}`
                }
            };
            const body = JSON.stringify({token: localStorage.getItem('access')});

            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config)

                if (res.data.code !== 'token_not_valid') {
                    dispatch(authActions.authenticatedSuccess());
                } else {
                    dispatch(authActions.authenticatedFail());
                }
            } catch (err) {
                dispatch(authActions.authenticatedFail());
            }

        } else {
            dispatch(authActions.authenticatedFail());
        }
    }
};

//the function posts user credentials, if valid the actions stores the access and refresh tokan in the local storage
export const loginUser = (email, password) => {
    return async (dispatch) => {
        // asynchronous function to send the login request to the server
        const sendRequest = async () => {

             const response = await fetch('/auth/jwt/create/', {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                 // .then (response => response.json())
                // .then(data=> console.log(data));
             ;

             // returning the promise from the post request
            return response;

        };

        try {
            const response = await sendRequest();
            const data = await response.json();

            console.log(response);
            console.log(response.status);
            console.log(data);

            await dispatch(
                authActions.loginSuccess({
                    access: data.access,
                    refresh: data.refresh,
                })
            );
            await dispatch(loadUser());

        } catch (error) {
            console.log("Login faild with error", error);
            await dispatch(authActions.loginFail());
        }
    };
};

export const resetPassword = (email) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({email});

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, body, config);

            dispatch(authActions.passwordResetSuccess());
        } catch (err) {
            dispatch(authActions.passwordResetFail());
        }
        ;
    }
};


export const resetPasswordConfirm = (uid, token, new_password, re_new_password) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({uid, token, new_password, re_new_password});

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config);

            dispatch(authActions.passwordResetConfirmSuccess());
        } catch (err) {
            dispatch(authActions.passwordResetConfirmFail());
        }
    }
};


export const tokenRefresh = (refresh) => {
    return async (dispatch) => {
        const sendRequest = async () => {
            const response = await fetch('auth/jwt/refresh/', {
                body: JSON.stringify({refresh: refresh}),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            return response;
        };

        try {
            const response = await sendRequest();
            const data = await response.json();
            // return data;
            alert('token ok')
            console.log('token ok')

            // dispatching and update to the  the state and the local storage
            dispatch(authActions.tokenRefresh({
                    access: data.access,
                    refresh: data.refresh,
                })
            );

        } catch (error) {
            alert("request has failed with error", error.message);
            dispatch(authActions.logout());
            return error
        }
    };
};

export const logout = (refresh) => {
    return async (dispatch) => {
        const sendRequest = async () => {
            const response = await axiosBase.post('accounts/api/logout/blacklist/', {refresh})
            return response
        };

        try {
            await sendRequest()
            dispatch(authActions.logout())
        } catch (err) {
        }
    }
};