import axios, { AxiosError, isAxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";

const server = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000/api",
    withCredentials: true
})

server.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isAxiosError(error) && error.response?.status === 401){
            useAuthStore.getState().setUser(null)
        }
        return Promise.reject(error)
    }
)
// logic for when cookie expires. sets user state to null, triggers a
// relogin in app.tsx









export default server

