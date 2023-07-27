import  axios from 'axios';
import { KEY_ACCESS_TOKEN, getItem, removeItem, setItem } from './localStorageManager';
import store from '../redux/Store';
import { TOAST_FAILURE } from '../App';
import { setLoading, showToast } from '../redux/slices/AppConfigureSlice';

export const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials:true
})



axiosClient.interceptors.request.use(
 (request)=>{
    store.dispatch(setLoading(true));
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    request.headers['Authorization'] = `Bearer ${accessToken}`;
    return request;
 }
);

axiosClient.interceptors.response.use(
    async(response)=>{
        store.dispatch(setLoading(false));
        const data = response.data;
        if(data.status==='ok'){
            // console.log("direct api access",data.statusCode);
            // console.log(data);
              return data;
              }

        const originalRequest = response.config;
        const statusCode = data.statusCode;
        const error = data.message;
 
        store.dispatch(showToast({
            type:TOAST_FAILURE,
            message:error
        }))

         if(statusCode===401 && !originalRequest._retry){
            originalRequest._retry=true;
            const response = await axios.get('/auth/refresh');
            console.log('after refreshing');
            if(response.status==='ok'){
                console.log("status coode is OK");
                const accessToken = response.result;
                setItem(accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axios(originalRequest);
            }
        else{
            console.log("removed access token");
            removeItem(KEY_ACCESS_TOKEN);
            window.location.replace('/login','_self');
            return Promise.reject(error);
        }
    } 
    return Promise.reject(error);     
        
    },
    async(error)=>{
        store.dispatch(setLoading(false));
        store.dispatch(showToast({
            type:TOAST_FAILURE,
            message:error.message
        }))
        return Promise.reject(error);
    }
);