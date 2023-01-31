import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {tokenRefresh} from "../redux/api/api";
import {axiosPrivate} from "../utils/axiosInstance";


const useAxiosPrivate = () => {

    // let refreshToken = localStorage.getItem('refresh') ? localStorage.getItem('refresh') : null
    const refreshToken = useSelector((state) => state.auth.refresh);
    const accessToken = useSelector((state) => state.auth.acess);

    const dispatch = useDispatch();

    useEffect(() => {
        // making the axios request
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (request) => {
                if (!request.headers['Authorization']) {
                    request.headers['Authorization'] = `JWT ${accessToken}`;
                }
                ;

                return request;

            }, (error) => {
                console.log('an error occured in the request check the configuration');
                Promise.reject(error);
            }
        );

        // catching the axios server response
        const responseIntercept = axiosPrivate.interceptors.response.use(
            // always return the response if the request was successful
            (response) => {
                /* do anything with the response */
                let data = response.data;

                return data;
            },

            /* if the request was unsuccessful trigger the token refresh function to request new access and refresh token
             and update the state and the local storage.  */

            async (error) => {
                // the code below gets the initial request with the initial configuration
                const prevRequest = error?.config;

                if (typeof error.response === 'undefined') {
                    alert(
                        'A server/network error occurred. ' +
                        'Looks like CORS might be the problem. ' +
                        'Sorry about this - we will get it fixed shortly.'
                    );
                    return Promise.reject(error);
                };

                // if (
                //     error.response.data.code === 'token_not_valid' &&
                //     error.response.status === 401 &&
                //     error.response.statusText === 'Unauthorized'
                // ) {
                // }

                // you can check for other responses from the request 403 stands for forbiden
                if (
                    error?.response?.status === 403 &&
                    !prevRequest?.sent  //&& error.response.data.code === 'token_not_valid'
                ) {
                    prevRequest.sent = true;

                    //dispatch the refresh token function to update the access and the refresh token
                    await dispatch(tokenRefresh(refreshToken));

                    prevRequest.headers['Authorization'] = `JWT ${accessToken}`;

                    // make a new request using the new access token
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [accessToken, dispatch, refreshToken]);

    return axiosPrivate;
};

export default useAxiosPrivate;


// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async function (error) {
//         const originalRequest = error.config;
//
//
//         if (
//             error.response.data.code === 'token_not_valid' &&
//             error.response.status === 401 &&
//             error.response.statusText === 'Unauthorized'
//         ) {
//             const refreshToken = localStorage.getItem('refresh_token');
//
//             if (refreshToken) {
//                 const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
//
//                 // exp date in token is expressed in seconds, while now() returns milliseconds:
//                 const now = Math.ceil(Date.now() / 1000);
//                 console.log(tokenParts.exp);
//
//                 if (tokenParts.exp > now) {
//                     return axiosInstance
//                         .post('/token/refresh/', {refresh: refreshToken})
//                         .then((response) => {
//                             localStorage.setItem('access_token', response.data.access);
//                             localStorage.setItem('refresh_token', response.data.refresh);
//
//                             axiosInstance.defaults.headers['Authorization'] =
//                                 'JWT ' + response.data.access;
//                             originalRequest.headers['Authorization'] =
//                                 'JWT ' + response.data.access;
//
//                             return axiosInstance(originalRequest);
//                         })
//                         .catch((err) => {
//                             console.log(err);
//                         });
//                 } else {
//                     console.log('Refresh token is expired', tokenParts.exp, now);
//                     window.location.href = '/login/';
//                 }
//             } else {
//                 console.log('Refresh token not available.');
//                 window.location.href = '/login/';
//             }
//         }
//     }
// );
//
// // export default axiosInstance;