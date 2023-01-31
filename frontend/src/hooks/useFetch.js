import {useDispatch} from "react-redux";
import {tokenRefresh} from "../redux/api/api";


let useFetch = () => {
    let config = {}

    const dispatch = useDispatch();

    let accessToken = localStorage.getItem('access') ? localStorage.getItem('access') : null
    let refreshToken = localStorage.getItem('refresh') ? localStorage.getItem('refresh') : null

    let originalRequest = async (url, config) => {
        // you can pass body to the config as a key when making the request

        // config['body'] = JSON.stringify({refresh: refresh})
        // config['method'] = ['POST', 'GET', 'PUT', 'DELETE']

        let response = await fetch(url, config)
        let data = await response.json()

        console.log('REQUESTING:', data)

        return {response, data}
    }


    let callFetch = async (url,  bodyData=null) => {
        // updating the headers with the tokens and the data to be attached to the request
        config['headers'] = {
            'Authorization': `JWT ${accessToken}`,
            'Content-Type':'application/json',
            'Accept':  'application/json'
        }
        if (bodyData){
            config['body'] = bodyData
        }

        let {response, data} = await originalRequest(url, config)

        if (response.statusText === 'unauthorized') {
            // dispatch token refresh call that updates the app state
            dispatch(tokenRefresh(refreshToken))
        }
        return {response, data}
    }

    return callFetch
}

export default useFetch;