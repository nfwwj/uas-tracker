import axios, { AxiosError } from "axios";

const server = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000/api"
    // withCredentials: true
})

export default server

