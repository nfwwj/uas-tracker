import server from "./server"
import type { login } from "../types/auth"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"
import type { CurrentUser } from "../types/auth"

export async function loginUser(data: login){
    const response = await server.post<CurrentUser>('/auth/login', data )
    // console.log("Login called. Response data: ", response.data)
    return response.data
}
export async function getMe(){
    const response = await server.get<{ user: CurrentUser | null }>('/auth/me')
    // console.log("Get me called. Response data: ", response.data)
    return response.data.user
}

export async function logoutUser(){
    await server.post('/auth/logout')
    console.log("Logged out.")
}
