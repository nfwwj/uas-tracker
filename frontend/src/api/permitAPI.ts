import server from "./server"
import type { createPermitandActivities, ParsedPermit, Permit } from "../types/permit"
import axios from "axios"


export async function getPermits() {
    // displayPermits
    // try and catch block here?
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

export async function getTotalNumPermits() {
    const response = await server.get<number>(`/permits/count`)
    return response.data
}

export async function searchPermits(applicationNumber: string) {
    const response = await server.get(`/permits/search`, { params: {applicationNumber} })
    return response.data
}

export async function parsePermit(text: string) {
    const response = await server.post<ParsedPermit>(`/permits/parse`, { text })
    return response.data
}

export async function addPermitandActivities(data: createPermitandActivities) {
    const response = await server.post(`/permits`, data)
    console.log(response)
    return response.data
}
