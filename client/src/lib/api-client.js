import axios from "axios";
import { HOST } from "../utils/constants";

export const apiClient = axios.create(
    {
        baseURL: HOST,
    }
);


// // 💫 Interceptor

// let isRefreshing = false;
// let subscribers = [];
// // let failedQueue = [];

// const processQueue = (error, token = null) => {
//     failedQueue.forEach(prom => {
//       if (error) {
//         prom.reject(error);
//       } else {
//         prom.resolve(token);
//       }
//     });
  
//     failedQueue = [];
//   };

// apiClient.interceptors.response.use(
//     response => response,
//     async (error) => {
//       const originalRequest = error.config;
  
//       if (
//         error.response?.status === 401 &&
//         !originalRequest._retry
//       ) {
//         originalRequest._retry = true;
  
//         if (isRefreshing) {
//           return new Promise(function (resolve, reject) {
//             failedQueue.push({ resolve, reject });
//           })
//             .then((token) => {
//               originalRequest.headers["Authorization"] = `Bearer ${token}`;
//               return apiClient(originalRequest);
//             })
//             .catch((err) => Promise.reject(err));
//         }
  
//         isRefreshing = true;
  
//         try {
//           const { data } = await axios.get(
//             `${HOST}${GET_NEW_ACCESS_TOKEN}`,
//             {
//               withCredentials: true,
//             }
//           );
  
//           const { accessToken, user } = data.data;
  
//           // Update user in zustand
//           const { setUserInfo } = userAppStore.getState();
//           setUserInfo(user);
  
//           // Retry original request with new token
//           originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
//           processQueue(null, accessToken);
//           return apiClient(originalRequest);
  
//         } catch (err) {
//           processQueue(err, null);
//           window.location.href = "/auth"; // Logout on refresh token failure
//           return Promise.reject(err);
//         } finally {
//           isRefreshing = false;
//         }
//       }
  
//       return Promise.reject(error);
//     }
//   );

