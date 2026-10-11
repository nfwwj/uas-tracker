import server from "./server"
import type { createPermitandActivities, ParsedPermit, Permit } from "../types/permit"
import axios from "axios"


export async function getPermits() {
    try{
        const response = await server.get<Permit[]>(`/permits`)
        return response.data
    }
    catch (error) {
        if (error instanceof axios.AxiosError) {
            throw new Error(error.message)
        }
        throw error
    }   
}

export async function parsePermit(text: string) {
    const response = await server.post<ParsedPermit>(`/permits/parse`, { text })
    return response.data
}

export async function addPermitandActivities(data: createPermitandActivities) {
    const response = await server.post(`/permits`, data)
    return response.data
}
